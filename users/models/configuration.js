import Joi from 'joi';
import dynogels from 'dynogels';

const TABLE_CONFIGURATION = process.env.TABLE_CONFIGURATION;

export default dynogels.define('Configuration', {
  hashKey: 'key',
  timestamps: true,
  tableName: TABLE_CONFIGURATION,

  schema: {
    key: Joi.string().required(),
    value: Joi.string().required(),
  },
});
