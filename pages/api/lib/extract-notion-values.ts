import images from '../../../public/notion-static/images.json';

const IMAGE_PUCLIC_PATH = '/notion-static/images/';

/* eslint-disable @typescript-eslint/indent */
export function extractNotionValues(notionValue, notionType) {
    switch (notionType) {
    case 'title':
        return notionValue.title[0]?.plain_text;
    case 'rich_text':
        return notionValue.rich_text[0]?.plain_text;
    case 'number':
        return notionValue.number;
    case 'select':
        return notionValue.select?.name;
    case 'multi_select':
        return notionValue.multi_select.map((x) => x?.name);
    case 'date':
        return new Date(notionValue.date?.start).getTime();
    case 'checkbox':
        return notionValue.checkbox || undefined;
    case 'files':
        return (
            notionValue.files
                .map((x) => {
                    const url = x?.file?.url;
                    const notionGUID = url.includes('notion-static.com')
                        ? url.match(/secure.notion-static.com\/(.*)\//)[1]
                        : '';
                    const image = images[notionGUID];

                    if (image) {
                        return {
                            id: image.id,
                            m: {
                                width: 600,
                                height: 800,
                                src: `${IMAGE_PUCLIC_PATH}m_${image.path}`,
                            },
                            s: {
                                width: 48,
                                height: 64,
                                src: `${IMAGE_PUCLIC_PATH}s_${image.path}`,
                            },
                        };
                    }
                    return null;
                })
                .filter((src) => src !== null) || []
        );
    case 'url':
        return notionValue.url;
    case 'email':
        return notionValue.email;
    case 'phone_number':
        return notionValue.phone_number;
    default:
        return '';
    }
}
