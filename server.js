'use strict';
//
// What port should be use?
const port = process.env.PORT || 3000;
//
// Basic required libraries.
const Koa = require('koa');
const koaBody = require('koa-body');
const koaSend = require('koa-send');
const koaStatic = require('koa-static');
const path = require('path');
//
// Importing DRTools.
const {
    ConfigsManager,
    EndpointsManager,
    KoaConnector,
    LoadersManager,
    MiddlewaresManager,
    PluginsManager,
    RoutesManager,
    TasksManager,
} = require('drtools');
//
// Creating an koa application.
global.koaApp = new Koa();
//
// Loading steps.
const loadingSteps = [];
//
// Loading DRTools configs.
loadingSteps.push(async () => {
    global.configs = new ConfigsManager(path.join(__dirname, 'configs'));
    global.env = global.configs.get('environment');
    global.envName = global.configs.environmentName();
    global.koaApp.use(global.configs.publishExportsForKoa());
});
//
// Loading parser.
loadingSteps.push(async () => {
    global.koaApp.use(koaBody());
});
//
// Loading DRTools KoaJS connector.
loadingSteps.push(async () => {
    KoaConnector.attach(global.koaApp, { webUi: global.env.drtools.webUi });
});
//
// Loading database assets.
loadingSteps.push(async () => {
    require('./includes/database');
});
//
// Loading DRTools loaders.
loadingSteps.push(async () => {
    const manager = new LoadersManager(path.join(__dirname, 'includes/loaders'), {}, global.configs);
    await manager.load();
});
//
// Loading DRTools middlewares.
loadingSteps.push(async () => {
    const manager = new MiddlewaresManager(global.koaApp, path.join(__dirname, 'includes/middlewares'), {}, global.configs);
    await manager.load();
});
//
// Loading DRTools plugins.
loadingSteps.push(async () => {
    const manager = new PluginsManager(path.join(__dirname, 'plugins'), {}, global.configs);
    await manager.load();
});
//
// Loading DRTools routes.
loadingSteps.push(async () => {
    const manager = new RoutesManager(global.koaApp, path.join(__dirname, 'includes/routes'), {}, global.configs);
    await manager.load();
});
//
// Loading DRTools tasks.
loadingSteps.push(async () => {
    const manager = new TasksManager(path.join(__dirname, 'includes/tasks'), {}, global.configs);
    await manager.load();
});
//
// Loading DRTools mock-endpoints.
loadingSteps.push(async () => {
    const endpoints = new EndpointsManager({
        directory: path.join(__dirname, 'includes/mock-endpoints'),
        uri: 'mock-api/v1.0',
    }, global.configs);
    global.koaApp.use(endpoints.provideForKoa());
});
//
// Setting static folders.
loadingSteps.push(async () => {
    global.koaApp.use(koaStatic(path.join(__dirname, 'public')));
});
//
// Setting default routes.
loadingSteps.push(async () => {
    global.koaApp.use(async ctx => {
        await koaSend(ctx, 'index.html', { root: path.join(__dirname, '/public') });
    });
});
//
// Steps loaders.
(async () => {
    try {
        for (const step of loadingSteps) {
            await step();
        }
        //
        // Starting server.
        global.koaApp.listen(port, () => {
            console.log(`\nListening on port '${port}'`);
        });
    } catch (err) {
        console.error(err);
    }
})();
