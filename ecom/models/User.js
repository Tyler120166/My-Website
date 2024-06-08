const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const uniqueValidator = require('mongoose-unique-validator');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: [true, 'Username is required'], 
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [50, 'Username cannot exceed 50 characters']
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'], 
        unique: true, 
        trim: true, 
        lowercase: true, 
        validate: [validator.isEmail, 'Please enter a valid email address'] 
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'], 
        minlength: [8, 'Password must be at least 8 characters long'],
        validate: {
            validator: function(value) {
                // Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character
                return /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(value);
            },
            message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        }
    },
    role: { 
        type: String, 
        enum: ['user', 'admin', 'superadmin'], 
        default: 'user' 
    },
    profilePicture: {
        type: String,
        default: '',
        validate: [validator.isURL, 'Please enter a valid URL for the profile picture']
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationTokenExpires: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpires: Date,
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    twoFactorSecret: String,
    status: {
        type: String,
        enum: ['active', 'inactive', 'banned'],
        default: 'active'
    },
    lockUntil: {
        type: Date
    },
    loginAttempts: {
        type: Number,
        required: true,
        default: 0
    },
    deleted: {
        type: Boolean,
        default: false
    },
    sessions: [
        {
            sessionId: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
            lastActivity: { type: Date, default: Date.now }
        }
    ],
    refreshTokens: [{
        token: { type: String, required: true },
        expires: { type: Date, required: true }
    }],
    tokenBlacklist: [String]
}, { 
    timestamps: true 
});

// Hash password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Method to compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate email verification token
userSchema.methods.generateEmailVerificationToken = function () {
    const token = crypto.randomBytes(20).toString('hex');
    this.emailVerificationToken = token;
    this.emailVerificationTokenExpires = Date.now() + 3600000; // 1 hour
    return token;
};

// Method to generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
    const token = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = token;
    this.resetPasswordTokenExpires = Date.now() + 3600000; // 1 hour
    return token;
};

// Method to increment login attempts
userSchema.methods.incrementLoginAttempts = async function () {
    if (this.lockUntil && this.lockUntil < Date.now()) {
        this.loginAttempts = 1;
        this.lockUntil = undefined;
    } else {
        this.loginAttempts += 1;
        if (this.loginAttempts >= 5) {
            this.lockUntil = Date.now() + 2 * 60 * 60 * 1000; // Lock account for 2 hours
        }
    }
    await this.save();
};

// Method to check if account is locked
userSchema.methods.isLocked = function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Method to manage user sessions
userSchema.methods.createSession = function () {
    const sessionId = crypto.randomBytes(20).toString('hex');
    this.sessions.push({ sessionId });
    return sessionId;
};

userSchema.methods.removeSession = async function (sessionId) {
    this.sessions = this.sessions.filter(session => session.sessionId !== sessionId);
    await this.save();
};

// Generate JWT token
userSchema.methods.generateJwtToken = function () {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Verify JWT token
userSchema.statics.verifyJwtToken = function (token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return null;
    }
};

// Method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
    const token = crypto.randomBytes(40).toString('hex');
    const expires = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    this.refreshTokens.push({ token, expires });
    return token;
};

// Remove expired refresh tokens
userSchema.methods.removeExpiredRefreshTokens = async function () {
    this.refreshTokens = this.refreshTokens.filter(rt => rt.expires > Date.now());
    await this.save();
};

// Method to blacklist token
userSchema.methods.blacklistToken = function (token) {
    this.tokenBlacklist.push(token);
    return this.save();
};

// Method to check if token is blacklisted
userSchema.methods.isTokenBlacklisted = function (token) {
    return this.tokenBlacklist.includes(token);
};

// Soft delete middleware
userSchema.pre('find', function (next) {
    this.where({ deleted: false });
    next();
});

userSchema.pre('findOne', function (next) {
    this.where({ deleted: false });
    next();
});

userSchema.pre('findOneAndUpdate', function (next) {
    this.where({ deleted: false });
    next();
});

userSchema.pre('findOneAndDelete', function (next) {
    this.where({ deleted: false });
    next();
});

userSchema.pre('findOneAndRemove', function (next) {
    this.where({ deleted: false });
    next();
});

userSchema.pre('updateOne', function (next) {
    this.where({ deleted: false });
    next();
});

// Ensure email uniqueness case-insensitively
userSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

module.exports = mongoose.model('User', userSchema);
