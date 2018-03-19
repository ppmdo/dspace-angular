import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';

import {
  CompleteInitAction,
  InitDefaultDefinitionAction,
  NewDefinitionAction,
  NewSectionDefinitionAction,
  SubmissionDefinitionActionTypes
} from './submission-definitions.actions';
import { SubmissionDefinitionsConfigService } from '../../core/config/submission-definitions-config.service';
import { SubmissionDefinitionsModel } from '../../core/shared/config/config-submission-definitions.model';
import { SubmissionSectionModel } from '../../core/shared/config/config-submission-section.model';
import { InitSubmissionFormAction } from '../objects/submission-objects.actions';
import { ConfigData } from '../../core/config/config-data';
import { SectionType } from '../section/section-type';

@Injectable()
export class SubmissionDefinitionEffects {

  @Effect() init$ = this.actions$
    .ofType(SubmissionDefinitionActionTypes.INIT_DEFAULT_DEFINITION)
    .switchMap((action: InitDefaultDefinitionAction) => {
      return this.definitionsConfigService.getConfigBySearch({scopeID: action.payload.collectionId})
        .flatMap((definitions: ConfigData) => definitions.payload)
        // .filter((definition: SubmissionDefinitionsModel) => definition.isDefault)
        .map((definition: SubmissionDefinitionsModel) => {
          const mappedActions = [];
          mappedActions.push(new NewDefinitionAction(definition));

          // START MODIFY
          const deduplication: SubmissionSectionModel = new SubmissionSectionModel();
          deduplication.name = 'Name';
          deduplication.type = 'submissionsection';
          deduplication.header = 'submit.progressbar.describe.deduplication';
          deduplication.mandatory = true;
          deduplication.sectionType = SectionType.Deduplication;
          deduplication.visibility = {
            main: null,
            other: 'READONLY'
          };
          deduplication.self = 'https://hasselt-dspace.dev01.4science.it/dspace-spring-rest/api/config/submissionsections/deduplication';
          deduplication._links = {self: deduplication.self};

          const sectionsss = [...definition.sections, deduplication];
          const definitionnn = Object.assign({}, definition, {sections: sectionsss});

          definitionnn.sections.forEach((section) => {
            console.log(section);
            mappedActions.push(
              new NewSectionDefinitionAction(
                definitionnn.name,
                section._links.self.substr(section._links.self.lastIndexOf('/') + 1),
                section as SubmissionSectionModel)
            );
          });
          return {action: action, definition: definitionnn, mappedActions: mappedActions};
        });
      // END MODIFY

        //   definition.sections.forEach((section) => {
        //     mappedActions.push(
        //       new NewSectionDefinitionAction(
        //         definition.name,
        //         section._links.self.substr(section._links.self.lastIndexOf('/') + 1),
        //         section as SubmissionSectionModel)
        //     );
        //   });
        //   return {action: action, definition: definition, mappedActions: mappedActions};
        // });
    })
    // .flatMap((result) => result)
    .mergeMap((result) => {
      return Observable.from(
        result.mappedActions.concat(
          new CompleteInitAction(
            result.action.payload.collectionId,
            result.definition.name,
            result.action.payload.submissionId,
            result.action.payload.selfUrl,
            result.action.payload.sections)
        ));
    });

  @Effect() complete$ = this.actions$
    .ofType(SubmissionDefinitionActionTypes.COMPLETE_INIT_DEFAULT_DEFINITION)
    .map((action: CompleteInitAction) =>
      new InitSubmissionFormAction(
        action.payload.collectionId,
        action.payload.definitionId,
        action.payload.submissionId,
        action.payload.selfUrl,
        action.payload.sections)
    );

  constructor(private actions$: Actions,
              private definitionsConfigService: SubmissionDefinitionsConfigService) {
  }
}
