import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {SearchResultItem} from '../../models/SearchResultItem';
import {EditConceptComponent} from '../../components/edit-concept/edit-concept.component';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {
  private confirmDeleteMessage = `Please confirm deletion concept with ID __ID__ ?`;
  diseases: string[] = null;
  dictionaries: string[] = null;
  pages: string[] = null;
  fields: string[] = null;
  results: SearchResultItem[] = null;

  searchModel = {
    conceptId: null,
    conceptDescription: null,
    conceptDictionary: null,
    conceptDisease: null,
    conceptPage: null,
    conceptField: null,
  };

  constructor(
    private modalService: NgbModal,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.api.getDictionaryList().subscribe(
      resp => {
        // TODO delete `console`, set received data to parameters.
        console.log(resp);
        this.diseases = ['dis1', 'dis2'];
        this.dictionaries = ['dic1', 'dic2'];
        this.pages = ['page 1', 'page 2'];
        this.fields = ['field 1', 'field 2'];
      },
      err => console.error(err)
    );
    // TODO delete mocked data in results
    this.results = [
      {
        id: 1231313,
        conceptId: 12,
        conceptDescription: 'some description',
        conceptDictionary: 'dic2',
        conceptDisease: 'dis1',
        conceptPage: 'page name1',
        conceptField: 'field name2'
      }
    ];
  }

  searchConcept() {
    this.api.searchConcept(this.searchModel).subscribe(
      rows => this.results = rows, // TODO check, maybe requires transformation of results array
      err => console.error(err)
    );
  }

  editConcept(item: SearchResultItem) {
    const modalRef = this.modalService.open(EditConceptComponent);
    modalRef.componentInstance.setData(item);
    modalRef.result.then(result => {
      this.api.editConcept(result.id, result).subscribe(
        resp => console.log('Updated', resp),
        err => console.error(err)
      );
    }).catch(() => {
      console.log(`Cancel editing ${item.conceptId}`);
    });
  }

  deleteConcept(item: SearchResultItem) {
    if (window.confirm(this.confirmDeleteMessage.replace('__ID__', item.conceptId.toString()))) {
      // TODO send DELETE request for deleting concept
      console.log('Delete', item.conceptId);
      this.api.deleteConcept(item.conceptId).subscribe(
        resp => console.log('Deleted', resp)
      );
    }
  }
}
