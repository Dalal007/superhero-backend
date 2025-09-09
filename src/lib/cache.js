import NodeCache from "node-cache";
export const appCache = new NodeCache({ stdTTL: 300, checkperiod: 60 }); // 5 min
