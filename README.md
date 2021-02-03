# aelf-community-activity

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Dependencies

### aelf-block-api

Github: [aelf-block-api](https://github.com/AElfProject/aelf-block-api)

We use the database of this api.

```bash
config/config.default.js -> config.mysql
```

#### mysql & sequelize

```bash
# config sequelize
database/config.json
config/config.default.js -> config.sequelize
```

```bash
yarn
npm run create-db # dev: npm run create-db:dev
npm run migrate # dev: npm run migrate:dev
# npm run undo-all

# if you want add a new column or create new Table.
# Go to https://sequelize.org/v5/manual/migrations.html
# Create a new migration and npm run migrate is ok.
```

### Config

Set you own keys, contract address, block chain provider, etc.

```bash
config/config.json
config/config.forserveronly.json
```

### Development

```bash
$ npm i
$ npm run watch:dev
$ npm run dev
$ open http://localhost:7100/
```

### Deploy

```bash
$ npm run build
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org 
