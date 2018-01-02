import Joi from 'joi';
import dynogels from 'dynogels';

const TABLE_USERS = process.env.TABLE_USERS;

export default dynogels.define('User', {
  hashKey: 'userId',
  timestamps: true,
  tableName: TABLE_USERS,

  schema: {
    userId: Joi.string().required(),
    name: Joi.string().required(),
    votes: Joi.number().integer().min(0).default(0),
  },
});
