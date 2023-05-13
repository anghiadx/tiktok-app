import { useState } from 'react';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';
import TippyHeadless from '@tippyjs/react/headless';
import styles from './CommentCreator.module.scss';
import SvgIcon from '~/components/SvgIcon';
import { iconEmoji } from '~/components/SvgIcon/iconsRepo';
import { PopperWrapper } from '~/components/Popper';

const cx = classNames.bind(styles);

const dataEmoji = [
    {
        tabIcon: '😊',
        tabValue: [
            '😀',
            '😃',
            '😃',
            '😁',
            '😆',
            '😅',
            '🤣',
            '😂',
            '🙂',
            '🙃',
            '😉',
            '😊',
            '😇',
            '😍',
            '😘',
            '😗',
            '😚',
            '😙',
            '😋',
            '😛',
            '😜',
            '😝',
            '🤑',
            '🤗',
            '🤔',
            '🤐',
            '😐',
            '😑',
            '😶',
            '😏',
            '😒',
            '🙄',
            '😬',
            '🤥',
            '😌',
            '😔',
            '😪',
            '🤤',
            '😴',
            '😷',
            '🤒',
            '🤕',
            '🤢',
            '🤧',
            '😵',
            '🤠',
            '😎',
            '🤓',
            '😕',
            '😟',
            '🙁',
            '😮',
            '😯',
            '😲',
            '😳',
            '😦',
            '😧',
            '😨',
            '😰',
            '😥',
            '😢',
            '😭',
            '😱',
            '😖',
            '😣',
            '😞',
            '😓',
            '😩',
            '😫',
            '😤',
            '😡',
            '😠',
            '😈',
            '👿',
        ],
    },
    {
        tabIcon: '😹',
        tabValue: [
            '😺',
            '😸',
            '😹',
            '😻',
            '😼',
            '😽',
            '🙀',
            '😿',
            '😾',
            '💀',
            '💩',
            '🤡',
            '👹',
            '👺',
            '👻',
            '👽',
            '👾',
            '🤖',
        ],
    },
];

function Emoji({ setCommentValue, maxValueLength }) {
    const [isShowEmojiPanel, setIsShowEmojiPanel] = useState(false);
    const [tabId, setTabId] = useState(0);

    const currentTab = dataEmoji[tabId];

    const tippyRender = (attrs) => (
        <div className={cx('emoji-panel')} tabIndex="-1" {...attrs}>
            <PopperWrapper className={cx('emoji-popper')}>
                <div className={cx('tab-value')}>
                    {currentTab.tabValue.map((emojiValue, index) => {
                        return (
                            <button
                                key={index}
                                className={cx('value-item')}
                                onClick={() => {
                                    handleClickEmoji(emojiValue);
                                }}
                            >
                                {emojiValue}
                            </button>
                        );
                    })}
                </div>
                <div className={cx('tab-list')}>
                    {dataEmoji.map((emojiTab, index) => {
                        return (
                            <button
                                key={index}
                                className={cx('tab-item', {
                                    active: index === tabId,
                                })}
                                onClick={() => {
                                    setTabId(index);
                                }}
                            >
                                {emojiTab.tabIcon}
                            </button>
                        );
                    })}
                </div>
            </PopperWrapper>
        </div>
    );

    const handleClickEmoji = (emoji) => {
        setCommentValue((commentValue) => {
            if (commentValue.length >= maxValueLength - 1) {
                return commentValue;
            }

            const newCommentValue = (commentValue += emoji);
            return newCommentValue;
        });
        setIsShowEmojiPanel(false);
    };
    return (
        <TippyHeadless
            render={tippyRender}
            zIndex={999999}
            interactive
            placement="top-start"
            visible={isShowEmojiPanel}
            onClickOutside={() => {
                setIsShowEmojiPanel(false);
            }}
        >
            <Tippy content="Nhấp để thêm Emoji" zIndex={999999}>
                <div className={cx('emoji', { active: isShowEmojiPanel })} onClick={() => setIsShowEmojiPanel(true)}>
                    <SvgIcon icon={iconEmoji} />
                </div>
            </Tippy>
        </TippyHeadless>
    );
}

export default Emoji;
