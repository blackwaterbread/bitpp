import Router from '@koa/router';
import routerV1 from './v1';
const rootRouter = new Router();

rootRouter.use('/v1', routerV1.routes());

export default rootRouter;