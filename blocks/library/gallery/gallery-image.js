/**
 * External Depenedencies
 */
import classnames from 'classnames';

/**
 * WordPress Dependencies
 */
import { Component } from '@wordpress/element';
import { IconButton, withAPIData, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Editable from '../../editable';

class GalleryImage extends Component {
	componentWillReceiveProps( { image } ) {
		if ( image && image.data && ! this.props.url ) {
			this.props.setAttributes( {
				url: image.data.source_url,
				alt: image.data.alt_text,
			} );
		}
	}

	render() {
		const { url, alt, id, linkTo, link, isSelected, caption, onClick, onRemove, focus, setAttributes, onFocus } = this.props;

		let href;

		switch ( linkTo ) {
			case 'media':
				href = url;
				break;
			case 'attachment':
				href = link;
				break;
		}

		const img = url ? <img src={ url } alt={ alt } data-id={ id } /> : <Spinner />;

		const className = classnames( 'blocks-gallery-image', {
			'is-selected': isSelected,
		} );

		// Disable reason: Each block can be selected by clicking on it and we should keep the same saved markup
		/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/onclick-has-role, jsx-a11y/click-events-have-key-events */
		return (
			<figure className={ className } onClick={ onClick }>
				{ isSelected &&
					<div className="blocks-gallery-image__inline-menu">
						<IconButton
							icon="no-alt"
							onClick={ onRemove }
							className="blocks-gallery-image__remove"
							label={ __( 'Remove Image' ) }
						/>
					</div>
				}
				{ href ? <a href={ href }>{ img }</a> : img }
				{ ( caption && caption.length > 0 ) || isSelected ? (
					<Editable
						tagName="figcaption"
						placeholder={ __( 'Write caption…' ) }
						value={ caption }
						focus={ focus }
						onFocus={ onFocus }
						onChange={ newCaption => setAttributes( { caption: newCaption } ) }
						inlineToolbar
					/>
				) : null }
			</figure>
		);
		/* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/onclick-has-role, jsx-a11y/click-events-have-key-events */
	}
}

export default withAPIData( ( { id } ) => ( {
	image: id ? `/wp/v2/media/${ id }` : {},
} ) )( GalleryImage );
