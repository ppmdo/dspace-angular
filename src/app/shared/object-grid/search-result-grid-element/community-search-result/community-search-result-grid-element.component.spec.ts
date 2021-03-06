import { CommunitySearchResultGridElementComponent } from './community-search-result-grid-element.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TruncatePipe } from '../../../utils/truncate.pipe';
import { Community } from '../../../../core/shared/community.model';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { CommunitySearchResult } from '../../../object-collection/shared/community-search-result.model';

let communitySearchResultGridElementComponent: CommunitySearchResultGridElementComponent;
let fixture: ComponentFixture<CommunitySearchResultGridElementComponent>;

const truncatableServiceStub: any = {
  isCollapsed: (id: number) => Observable.of(true),
};

const mockCommunityWithAbstract: CommunitySearchResult = new CommunitySearchResult();
mockCommunityWithAbstract.hitHighlights = [];
mockCommunityWithAbstract.dspaceObject = Object.assign(new Community(), {
  metadata: [
    {
      key: 'dc.description.abstract',
      language: 'en_US',
      value: 'Short description'
    } ]
});

const mockCommunityWithoutAbstract: CommunitySearchResult = new CommunitySearchResult();
mockCommunityWithoutAbstract.hitHighlights = [];
mockCommunityWithoutAbstract.dspaceObject = Object.assign(new Community(), {
  metadata: [
    {
      key: 'dc.title',
      language: 'en_US',
      value: 'Test title'
    } ]
});

describe('CommunitySearchResultGridElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunitySearchResultGridElementComponent, TruncatePipe ],
      providers: [
        { provide: TruncatableService, useValue: truncatableServiceStub },
        { provide: 'objectElementProvider', useValue: (mockCommunityWithAbstract) }
      ],

      schemas: [ NO_ERRORS_SCHEMA ]
    }).overrideComponent(CommunitySearchResultGridElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CommunitySearchResultGridElementComponent);
    communitySearchResultGridElementComponent = fixture.componentInstance;
  }));

  describe('When the community has an abstract', () => {
    beforeEach(() => {
      communitySearchResultGridElementComponent.dso = mockCommunityWithAbstract.dspaceObject;
      fixture.detectChanges();
    });

    it('should show the description paragraph', () => {
      const communityAbstractField = fixture.debugElement.query(By.css('p.card-text'));
      expect(communityAbstractField).not.toBeNull();
    });
  });

  describe('When the community has no abstract', () => {
    beforeEach(() => {
      communitySearchResultGridElementComponent.dso = mockCommunityWithoutAbstract.dspaceObject;
      fixture.detectChanges();
    });

    it('should not show the description paragraph', () => {
      const communityAbstractField = fixture.debugElement.query(By.css('p.card-text'));
      expect(communityAbstractField).toBeNull();
    });
  });
});
