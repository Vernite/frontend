/* tslint:disable:no-unused-variable */

import { HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { WorkspaceService } from './workspace.service';

describe('Service: Workspace', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [WorkspaceService],
    });
  });

  it('should ...', inject([WorkspaceService], (service: WorkspaceService) => {
    expect(service).to.be.true;
  }));
});
