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

configurationSchema.statics.getValue = async function getValue(key) {
  const configurationItem = await this.get({ [hashKey]: key });

  if (!configurationItem) {
    throw new Error(`Invalid ${key} configuration item`);
  }

  return configurationItem[fields.value];
};

export default dynamoose.model(tableName, configurationSchema);
