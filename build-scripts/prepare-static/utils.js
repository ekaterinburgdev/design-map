export function log(message = '', getMessage = () => '') {
    return (...args) => {
        console.log(message, getMessage(...args));
        return Promise.resolve(...args);
    };
}

export function getNotionGUID(notionFileUrl) {
    return new URL(notionFileUrl).pathname.split('/').at(-2);
}
