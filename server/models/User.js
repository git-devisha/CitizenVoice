import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const permissionSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  resource: String,
  action: {
    type: String,
    enum: ['create', 'read', 'update', 'delete', 'manage']
  }
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: ['super_admin', 'admin', 'department_head', 'officer'],
    default: 'officer'
  },
  department: {
    type: String,
    enum: [
      'public-works',
      'health-sanitation',
      'law-order',
      'education',
      'transport',
      'environment',
      'utilities',
      'housing'
    ]
  },
  permissions: [permissionSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  phone: {
    type: String,
    trim: true
  },
  avatar: {
    type: String
  },
  lastLogin: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.model('User', userSchema);