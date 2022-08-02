const parseNotionValues = (notionValue, notionType) => {
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
            return notionValue.multi_select.map(x => x?.name);
        case 'date':
            return new Date(notionValue.date?.start).getTime();
        case 'checkbox':
            return notionValue.checkbox || undefined;
        case "files":
            const files = notionValue.files.map(x => x?.file?.url) || [];
            return files;
        case 'url':
            return notionValue.url;
        case 'email':
            return notionValue.email;
        case 'phone_number':
            return notionValue.phone_number;
    }
}

export default parseNotionValues;