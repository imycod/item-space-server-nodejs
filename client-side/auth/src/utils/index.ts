export function parseUrl(url) {
    const parsedUrl = new URL(url);
    const params = {};

    // 获取查询参数
    parsedUrl.searchParams.forEach((value, key) => {
        params[key] = value;
    });

    return {
        protocol: parsedUrl.protocol,
        host: parsedUrl.host,
        pathname: parsedUrl.pathname,
        params: params
    };
}