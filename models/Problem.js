import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  shortBody: String,
  body: {
    type: String,
    required: true
  },
  typeId:{
    type:Number,
    required:true
  },
  interactive: {
    type: Boolean,
    default: false
  },
  masterjudge: {
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    uri: {
      type: String,
      required: true
    }
  },
  testcases: [
    {
      number: Number,
      active: {
        type: Boolean,
        default: true
      }
    }
  ],
  lastModified:{
    type:Date,
    default:Date.now
  },
  permissions: {
    edit: {
      type: Boolean,
      default: true
    },
    clone: {
      type: Boolean,
      default: true
    }
  }
});

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;