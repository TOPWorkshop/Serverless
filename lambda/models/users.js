import dynamoose from 'dynamoose';

export const tableName = process.env.TABLE_USERS;
export const fields = {
  userId: 'userId',
  name: 'name',
  votes: 'votes',
};
export const hashKey = fields.userId;

const userSchema = new dynamoose.Schema({
  [hashKey]: {
    type: String,
    required: true,
    hashKey: true,
  },

  [fields.name]: {
    type: String,
    required: true,
  },

  [fields.votes]: {
    type: Number,
    required: true,
    default: 0,
    validate: value => value >= 0,
  },
}, {
  timestamps: true,
});

userSchema.statics.vote = function vote(userId) {
  return this.update({ [hashKey]: userId }, { $ADD: { [fields.votes]: 1 } }, {
    condition: 'attribute_exists(#hashKey)',
    conditionNames: { hashKey },
  });
};

export default dynamoose.model(tableName, userSchema);
