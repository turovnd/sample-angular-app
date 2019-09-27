import { Component } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-edit-concept',
  templateUrl: './edit-concept.component.html',
  styleUrls: ['./edit-concept.component.scss']
})
export class EditConceptComponent {
  dataModel = {
    conceptId: null,
    conceptDescription: null,
    conceptDictionary: null,
    conceptDisease: null,
    conceptPage: null,
    conceptField: null,
  };
  diseases: string[] = null;
  dictionaries: string[] = null;
  pages: string[] = null;
  fields: string[] = null;

  constructor(
    private activeModal: NgbActiveModal,
    private api: ApiService
  ) {}

  setData(data) {
    this.dataModel.conceptId = data.conceptId;
    this.dataModel.conceptDescription = data.conceptDescription;
    this.dataModel.conceptDictionary = data.conceptDictionary;
    this.dataModel.conceptDisease = data.conceptDisease;
    this.dataModel.conceptPage = data.conceptPage ? data.conceptPage : null;
    this.dataModel.conceptField = data.conceptField ? data.conceptField : null;
    this.loadDiseases();
    this.loadDictionaries();
    this.loadPages();
    this.loadFields();
  }

  handleClose() {
    this.activeModal.dismiss();
    this.dataModel.conceptId = null;
    this.dataModel.conceptDescription = null;
    this.dataModel.conceptDisease = null;
    this.dataModel.conceptDictionary = null;
    this.dataModel.conceptPage = null;
    this.dataModel.conceptField = null;
    this.diseases = null;
    this.dictionaries = null;
    this.pages = null;
    this.fields = null;
  }

  handleSubmit() {
    this.activeModal.close(this.dataModel);
  }

  handleSelectChange(field) {
    this.dataModel.conceptField = null;
    this.fields = [];
    switch (field) {
      case 'conceptDisease':
        this.dataModel.conceptDictionary = null;
        this.dataModel.conceptPage = null;
        this.dictionaries = [];
        this.pages = [];
        this.loadDictionaries();
        break;
      case 'conceptDictionary':
        this.dataModel.conceptPage = null;
        this.pages = [];
        this.loadPages();
        break;
      case 'conceptPage':
        this.loadFields();
        break;
    }
  }

  loadDiseases() {
    this.api.getDiseases().subscribe(
      data => this.diseases = data, // TODO: check that diseases have an `string[]`
      err => console.error(err)
    );
  }

  loadDictionaries() {
    this.api.getDictionaries({
      disease: this.dataModel.conceptDisease
    }).subscribe(
      data => this.dictionaries = data, // TODO: check that dictionaries have a `string[]`
      err => console.error(err)
    );
  }

  loadPages() {
    this.api.getPagesNames({
      disease: this.dataModel.conceptDisease,
      name: this.dataModel.conceptDictionary
    }).subscribe(
      data => this.pages = data, // TODO: check that dictionaries have a `string[]`
      err => console.error(err)
    );
  }

  loadFields() {
    this.api.getFieldsNames({
      disease: this.dataModel.conceptDisease,
      name: this.dataModel.conceptDictionary,
      page: this.dataModel.conceptPage
    }).subscribe(
      data => this.fields = data, // TODO: check that pages have a `string[]`
      err => console.error(err)
    );
  }
}
