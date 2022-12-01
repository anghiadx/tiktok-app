import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './HashtagFilter.module.scss';

const cx = classNames.bind(styles);

function HashtagFilter({ children, onCloseModal }) {
    const childArray = children.split(' ');

    const output = childArray.reduce((acc, string) => {
        let thisElement = string;

        if (string.includes('#')) {
            const tagArray = string.split('#');

            thisElement = [];
            !!tagArray[0] && thisElement.push(tagArray[0]);
            // Remove first element
            tagArray.shift();

            tagArray.forEach((tag) => {
                if (tag) {
                    const tagEncoded = encodeURIComponent(tag);
                    const tagElement = (
                        <Link
                            key={Math.random()}
                            to={'/hashtag/' + tagEncoded}
                            className={cx('hashtag')}
                            target="_blank"
                            onClick={onCloseModal}
                        >
                            #{tag}
                        </Link>
                    );

                    thisElement.push(tagElement);
                } else {
                    thisElement.push('#');
                }
            });
        }

        return acc.concat(thisElement, ' ');
    }, []);

    return output;
}
HashtagFilter.propTypes = {
    children: PropTypes.string.isRequired,
    onCloseModal: PropTypes.func,
};
export default HashtagFilter;
