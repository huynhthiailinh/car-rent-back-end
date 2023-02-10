import { DataSource } from 'typeorm';
import { dataSource } from './data-source';

export default new DataSource({
  ...dataSource,
  migrations: [__dirname + '/seedings/*.ts'],
  migrationsTableName: 'seedings',
});
