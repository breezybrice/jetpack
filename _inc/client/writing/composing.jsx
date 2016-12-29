/**
 * External dependencies
 */
import React from 'react';
import analytics from 'lib/analytics';
import { translate as __ } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import {
	FormFieldset,
	FormLegend,
	FormLabel,
	FormButton
} from 'components/forms';
import { getModule as _getModule } from 'state/modules';
import { ModuleToggle } from 'components/module-toggle';
import { ModuleSettingsForm as moduleSettingsForm } from 'components/module-settings/module-settings-form';
import { ModuleSettingCheckbox } from 'components/module-settings/form-components';
import TagsInput from 'components/tags-input';
import SettingsCard from 'components/settings-card';

export const Composing = moduleSettingsForm(
	React.createClass( {
		getCheckbox( setting, label, isAtd = true ) {
			let markdown = this.props.getModule( 'markdown' );
			let atd = this.props.getModule( 'after-the-deadline' );

			return(
				<ModuleSettingCheckbox
					name={ setting }
					module={ isAtd ? atd : markdown }
					label={ label }
					{ ...this.props }
				/>
			);
		},

		toggleModule( name, value ) {
			this.props.updateFormStateOptionValue( name, !value );
		},

		getAtdSettings() {
			return (
				<div>
					<FormFieldset>
						<span className="jp-form-setting-explanation">
							{ __( 'Automatically proofread content when: ' ) }
						</span>
						{ this.getCheckbox( 'onpublish', __( 'A post or page is first published' ) ) }
						{ this.getCheckbox( 'onupdate', __( 'A post or page is updated' ) ) }
					</FormFieldset>
					<FormFieldset>
						<FormLegend> { __( 'Automatic Language Detection' ) }
						</FormLegend>
						<span className="jp-form-setting-explanation">
							{ __(
								  'The proofreader supports English, French, ' +
								  'German, Portuguese and Spanish.'
							  ) }
						</span>
						{
							this.getCheckbox(
								'guess_lang',
								__( 'Use automatically detected language to proofread posts and pages' )
							)
						}
					</FormFieldset>
					<FormFieldset>
						<FormLegend> { __( 'English Options' ) } </FormLegend>
						<span className="jp-form-setting-explanation">
							{ __( 'Enable proofreading for the following grammar and style rules: ' ) }
						</span>
						{ this.getCheckbox( 'Bias Language', __( 'Bias Language' ) ) }
						{ this.getCheckbox( 'Cliches', __( 'Clichés' ) ) }
						{ this.getCheckbox( 'Complex Expression', __( 'Complex Phrases' ) ) }
						{ this.getCheckbox( 'Diacritical Marks', __( 'Diacritical Marks' ) ) }
						{ this.getCheckbox( 'Double Negative', __( 'Double Negatives' ) ) }
						{ this.getCheckbox( 'Hidden Verbs', __( 'Hidden Verbs' ) ) }
						{ this.getCheckbox( 'Jargon Language', __( 'Jargon' ) ) }
						{ this.getCheckbox( 'Passive voice', __( 'Passive Voice' ) ) }
						{ this.getCheckbox( 'Phrases to Avoid', __( 'Phrases to Avoid' ) ) }
						{ this.getCheckbox( 'Redundant Expression', __( 'Redundant Phrases' ) ) }
					</FormFieldset>
					<FormFieldset>
						<FormLegend>
							{ __( 'Ignored Phrases' ) }
						</FormLegend>
						<TagsInput
							name="ignored_phrases"
							placeholder={ __( 'Add a phrase' ) }
							value={
								(
									'undefined' !== typeof this.props.getOptionValue( 'ignored_phrases' )
									&& '' !== this.props.getOptionValue( 'ignored_phrases' )
								)
								 ? this.props.getOptionValue( 'ignored_phrases' ).split( ',' )
								 : []
								  }
							onChange={ this.props.onOptionChange } />
					</FormFieldset>
				</div>
			);
		},

		render() {
			let markdown = this.props.getModule( 'markdown' );
			let atd = this.props.getModule( 'after-the-deadline' );

			// Getting text data about modules and seeing if it's being searched for
			let list = [ markdown, atd ].map( function( m ) {
				if ( ! this.props.searchTerm ) {
					return true;
				}

				let text = [
					m.module,
					m.name,
					m.description,
					m.learn_more_button,
					m.long_description,
					m.search_terms,
					m.additional_search_queries,
					m.short_description,
					m.feature.toString()
				].toString();

				return text.toLowerCase().indexOf( this.props.searchTerm ) > -1;
			}, this);

			let markdownSettings = (
				<FormFieldset>
					<ModuleToggle slug={ 'markdown' }
								  compact
								  activated={ this.props.getOptionValue( 'markdown' ) }
								  toggling={ this.props.isSavingAnyOption() }
								  toggleModule={ this.toggleModule }>
						<span className="jp-form-toggle-explanation">
							{ markdown.description }
						</span>
					</ModuleToggle>
				</FormFieldset>
			);

			let atdSettings = (
				<FormFieldset>
					<ModuleToggle slug={ 'after-the-deadline' }
								  compact
								  activated={ this.props.getOptionValue( 'after-the-deadline' ) }
								  toggling={ this.props.isSavingAnyOption() }
								  toggleModule={ this.toggleModule }>
						<span className="jp-form-toggle-explanation">
							{ atd.description }
						</span>
					</ModuleToggle>
					{ this.props.getOptionValue( 'after-the-deadline' )
					  ? this.getAtdSettings()
					  : ''
					}
				</FormFieldset>
			);

			// If we don't have any element to show, return early
			if ( ! list.some( function( element ) { return !! element; } ) ) {
				return <span />;
			}

			return (
				<SettingsCard header={ __( 'Composing', { context: 'Settings header' } ) } { ...this.props }>
					{ list[0] ? markdownSettings : '' }
					{ list[1] ? atdSettings : '' }
				</SettingsCard>
			);
		}
	} )
);
