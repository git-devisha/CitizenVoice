import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  department: {
    type: String,
    required: true,
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
  category: {
    type: String,
    required: true,
    enum: [
      'Service Disruption',
      'Infrastructure Issue',
      'Safety Concern',
      'Quality Issue',
      'Accessibility Problem',
      'Staff Behavior',
      'Policy Concern',
      'Other'
    ]
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    required: true,
    enum: ['submitted', 'in-review', 'in-progress', 'resolved', 'closed'],
    default: 'submitted'
  },
  location: {
    address: {
      type: String,
      required: true,
      trim: true
    },
    area: {
      type: String,
      required: true,
      trim: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  anonymous: {
    type: Boolean,
    default: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  attachments: [{
    type: String
  }],
  statusHistory: [{
    status: {
      type: String,
      enum: ['submitted', 'in-review', 'in-progress', 'resolved', 'closed']
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
complaintSchema.index({ department: 1, status: 1 });
complaintSchema.index({ createdAt: -1 });
complaintSchema.index({ priority: 1, status: 1 });
complaintSchema.index({ 'location.area': 1 });

// Add status change to history before saving
complaintSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date()
    });
  }
  next();
});

export default mongoose.model('Complaint', complaintSchema);