import React from 'react';

export function Footer() {
    return (
        <div className="footer-logo">
            <a className="logo-to-main-page" href="https://ekaterinburg.design/">
                <div className="logo">
                    <img
                        className="lazy entered loaded"
                        data-src="/img/logo-transparent.svg"
                        data-ll-status="loaded"
                        src="/img/logo-transparent.svg"
                    />
                </div>
                <div className="logo-caption">
                    <span>
                        Дизайн-код
                        <br />
                        Екатеринбурга
                    </span>
                </div>
            </a>
            <div className="social-links">
                <a className="telegram" target="_blank" href="https://t.me/ekaterinburgdesign">
                    <img
                        className="lazy entered loaded"
                        data-src="/img/telegram-white.svg"
                        data-ll-status="loaded"
                        src="/img/telegram-white.svg"
                    />
                </a>
                <a
                    className="instagram"
                    target="_blank"
                    href="https://www.instagram.com/ekaterinburg.design/"
                >
                    <img
                        className="lazy entered loaded"
                        data-src="/img/instagram-white.svg"
                        data-ll-status="loaded"
                        src="/img/instagram-white.svg"
                    />
                </a>
                <a className="vk" target="_blank" href="https://vk.com/ekaterinburg.design">
                    <img
                        className="lazy entered loaded"
                        data-src="/img/vk-white.svg"
                        data-ll-status="loaded"
                        src="/img/vk-white.svg"
                    />
                </a>
                <a
                    className="youtube"
                    target="_blank"
                    href="https://www.youtube.com/c/ekaterinburgdesign"
                >
                    <img
                        className="lazy entered loaded"
                        data-src="/img/youtube-white.svg"
                        data-ll-status="loaded"
                        src="/img/youtube-white.svg"
                    />
                </a>
                <a className="zen" target="_blank" href="https://zen.yandex.ru/ekaterinburgdesign">
                    <img
                        className="lazy entered loaded"
                        data-src="/img/zen-white.svg"
                        data-ll-status="loaded"
                        src="/img/zen-white.svg"
                    />
                </a>
                <a
                    className="fb"
                    target="_blank"
                    href="https://www.facebook.com/ekaterinburg.design"
                >
                    <img
                        className="lazy entered loaded"
                        data-src="/img/fb-white.svg"
                        data-ll-status="loaded"
                        src="/img/fb-white.svg"
                    />
                </a>
                <a
                    className="behance"
                    target="_blank"
                    href="https://www.behance.net/ekaterinburgdesign"
                >
                    <img
                        className="lazy entered loaded"
                        data-src="/img/behance-white.svg"
                        data-ll-status="loaded"
                        src="/img/behance-white.svg"
                    />
                </a>
                <a className="github" target="_blank" href="https://github.com/ekaterinburgdesign/">
                    <img
                        className="lazy entered loaded"
                        data-src="/img/github-white.svg"
                        data-ll-status="loaded"
                        src="/img/github-white.svg"
                    />
                </a>
                <a className="mail-btn" href="mailto:mail@ekaterinburg.design">
                    <span>Написать нам</span>
                </a>
            </div>
        </div>
    );
}
