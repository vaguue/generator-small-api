import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const dev = (process.env.NODE_ENV || global.env) !== 'production';

const <%= name %>Schema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    default: uuidv4,
  },
});

let model;
if (dev) {
  if (mongoose.models.<%= name %>) {
    delete mongoose.connection.models.<%= name %>;
  }
  model = mongoose.model('<%= name %>', <%= name %>Schema);
}
else {
  model = mongoose.models.<%= name %> || mongoose.model('<%= name %>', <%= name %>Schema);
}

export default model;
