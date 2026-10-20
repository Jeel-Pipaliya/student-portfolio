import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      minlength: [2, 'Title must be at least 2 characters long']
    },
    description: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: 'General'
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'Low', 'Medium', 'High'],
        message: 'Priority must be either low, medium, or high'
      },
      default: 'medium'
    },
    completed: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        return ret;
      }
    }
  }
);

// Supplementary Problem 2: Pre-save hook automatically trimming whitespace from title
taskSchema.pre('save', function (next) {
  if (this.title) {
    this.title = this.title.trim();
  }
  if (this.priority) {
    this.priority = this.priority.toLowerCase();
  }
  next();
});

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

export default Task;
