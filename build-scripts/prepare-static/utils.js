export function log(message = '', getMessage = () => '') {
    return (...args) => {
        console.log(message, getMessage(...args));
        return Promise.resolve(...args);
    };
}

export const getNotionGUID = (url) =>
    url.includes('notion-static.com') ? url.match(/secure.notion-static.com\/(.*)\//)[1] : '';
