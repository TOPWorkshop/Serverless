import dynamoose from 'dynamoose';

export const tableName = process.env.TABLE_CONFIGURATION;
export const fields = {
  key: 'key',
  value: 'value',
};
export const hashKey = fields.key;


const configurationSchema = new dynamoose.Schema({
  [hashKey]: {
    type: String,
    required: true,
    hashKey: true,
  },

  [fields.value]: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export default dynamoose.model(tableName, configurationSchema);
