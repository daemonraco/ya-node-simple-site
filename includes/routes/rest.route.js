'use strict';

const HttpStatusCodes = require('http-status-codes');
const Router = require('koa-router');
const { MyTable } = require('../database');

const router = Router();

const models = {
    'my-table': MyTable,
};

const checkTable = async (ctx, next) => {
    if (models[ctx.params.table] === undefined) {
        ctx.throw(HttpStatusCodes.NOT_FOUND, `Unknown table '${ctx.params.table}'`);
    } else {
        await next();
    }
};
//
// Get all
router.get(`/:table`, checkTable, async ctx => {
    const query = ctx.query.query ? JSON.parse(ctx.query.query) : {};

    const operation = models[ctx.params.table]
        .query(q => {
            if (Array.isArray(query)) {
                q.where(...query);
            } else {
                q.where(query);
            }
        });
    if (ctx.query.order) {
        const order = ctx.query.order.split(' ');
        operation.orderBy(...order);
    }

    const results = await operation.fetchPage({
        page: ctx.query.page || 1,
        pageSize: ctx.query.pageSize || 25,
        withRelated: ctx.query.expand ? ctx.query.expand.split(',') : [],
    });

    ctx.body = {
        entries: results.toJSON(),
        pagination: results.pagination,
    };
});
//
// Get by ID
router.get(`/:table/:id`, checkTable, async ctx => {
    const results = await models[ctx.params.table]
        .where('id', ctx.params.id).fetch({
            withRelated: ctx.query.expand ? ctx.query.expand.split(',') : [],
        });

    if (results) {
        ctx.body = results.toJSON();
    } else {
        ctx.throw(HttpStatusCodes.NOT_FOUND, `Unknown id '${ctx.params.id}'`);
    }
});
//
// Insert
router.post(`/:table`, checkTable, async ctx => {
    if (!ctx.request.body) {
        ctx.throw(HttpStatusCodes.BAD_REQUEST);
    } else {
        const entry = new models[ctx.params.table](ctx.request.body);
        await entry.save();
        ctx.body = entry.toJSON();
    }
});
//
// Update by ID
router.put(`/:table/:id`, checkTable, async ctx => {
    const results = await models[ctx.params.table]
        .where('id', ctx.params.id).fetch();

    if (results) {
        await results.save(ctx.request.body, {
            method: 'update',
            patch: true,
        });
        ctx.body = results.toJSON();
    } else {
        ctx.throw(HttpStatusCodes.NOT_FOUND, `Unknown id '${ctx.params.id}'`);
    }
});
//
// Delete by ID
router.delete(`/:table/:id`, checkTable, async ctx => {
    const results = await models[ctx.params.table]
        .where('id', ctx.params.id).fetch();

    if (results) {
        ctx.body = await results.destroy();
    } else {
        ctx.throw(HttpStatusCodes.NOT_FOUND, `Unknown id '${ctx.params.id}'`);
    }
});
//
// Search
router.post(`/search/:table`, checkTable, async ctx => {
    const operation = models[ctx.params.table]
        .query(q => {
            for (const condition of ctx.request.body) {
                q.where(...condition);
            }
        });
    if (ctx.query.order) {
        operation.orderBy(ctx.query.order);
    }

    const results = await operation.fetchPage({
        page: ctx.query.page || 1,
        pageSize: ctx.query.pageSize || 25,
        withRelated: ctx.query.expand ? ctx.query.expand.split(',') : [],
    });

    ctx.body = {
        entries: results.toJSON(),
        pagination: results.pagination,
    };
});

module.exports = router;
