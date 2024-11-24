import { useEffect, useState } from 'react';
import { copy } from './copy';

export function useCopyUrl(memo) {
    const [isCopied, setCopied] = useState(false);

    // reset on chamge "memo"
    useEffect(() => setCopied(false), [memo]);

    return {
        isCopied,
        onCopy: () => {
            // don't include location.pathname into an url
            const currentUrl = `${window.location.origin}/${window.location.hash}`;

            copy(currentUrl);
            setCopied(true);
        },
    };
}
