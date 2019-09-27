import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-new-concept',
  templateUrl: './new-concept.component.html',
  styleUrls: ['./new-concept.component.scss']
})
export class NewConceptComponent implements OnInit {
  dataModel = {
    conceptId: null,
    conceptDescription: null,
    conceptDisease: null,
    conceptDiseaseNew: null,
    conceptDictionary: null,
    conceptDictionaryNew: null,
    conceptPage: null,
    conceptPageNew: null,
    conceptField: null,
    conceptFieldNew: null,
  };
  bulkUploadFile: File = null;
  acceptFilesFormat: any = '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';
  diseases: string[] = null;
  dictionaries: string[] = null;
  pages: string[] = null;
  fields: string[] = null;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.loadDiseases();
  }

  onFileChange(files) {
    this.bulkUploadFile = files[0] || null;
  }

  createConcept() {
    if (this.dataModel.conceptDisease === 'new' && !this.dataModel.conceptDiseaseNew) {
      return alert('Enter disease name');
    } else if (this.dataModel.conceptDictionary === 'new' && !this.dataModel.conceptDictionaryNew) {
      return alert('Enter dictionary name');
    }

    this.api.addConcept({
      conceptId: this.dataModel.conceptId,
      conceptDescription: this.dataModel.conceptDescription,
      conceptDisease: this.dataModel.conceptDisease === 'new' ? this.dataModel.conceptDiseaseNew : this.dataModel.conceptDisease,
      conceptDictionary: this.dataModel.conceptDictionary === 'new' ? this.dataModel.conceptDictionaryNew : this.dataModel.conceptDictionary,
      conceptPage: this.dataModel.conceptPage === 'new' ? this.dataModel.conceptPageNew : this.dataModel.conceptPage,
      conceptField: this.dataModel.conceptField === 'new' ? this.dataModel.conceptFieldNew : this.dataModel.conceptField
    }).subscribe(
      resp => {
        console.log('Added', resp);
        this.clearForm();
      },
      err => console.error(err)
    );
  }

  uploadFile() {
    console.log('Start uploading', this.bulkUploadFile);
    this.api.uploadDictionaryFile(this.bulkUploadFile).subscribe(
      resp => console.log(resp),
      err => console.error(err)
    );
  }

  handleSelectChange(field) {
    this.dataModel.conceptField = null;
    this.dataModel.conceptFieldNew = null;
    this.fields = [];
    switch (field) {
      case 'conceptDisease':
        this.dataModel.conceptDictionary = null;
        this.dataModel.conceptDictionaryNew = null;
        this.dataModel.conceptPage = null;
        this.dataModel.conceptPageNew = null;
        this.dictionaries = [];
        this.pages = [];
        if (this.dataModel.conceptDisease === 'new') {
          this.dataModel.conceptDictionary = 'new';
        } else {
          this.loadDictionaries();
        }
        break;
      case 'conceptDictionary':
        this.dataModel.conceptPage = null;
        this.dataModel.conceptPageNew = null;
        this.pages = [];
        if (this.dataModel.conceptDisease === 'new') {
          this.dataModel.conceptPage = 'new';
        } else {
         this.loadPages();
        }
        break;
      case 'conceptPage':
        this.loadFields();
        break;
    }
  }

  clearForm() {
    this.dataModel.conceptId = null;
    this.dataModel.conceptDescription = null;
    this.dataModel.conceptDisease = null;
    this.dataModel.conceptDiseaseNew = null;
    this.dataModel.conceptDictionary = null;
    this.dataModel.conceptDictionaryNew = null;
    this.dataModel.conceptPage = null;
    this.dataModel.conceptPageNew = null;
    this.dataModel.conceptField = null;
    this.dataModel.conceptFieldNew = null;
    this.bulkUploadFile = null;
    this.diseases = null;
    this.dictionaries = null;
    this.pages = null;
    this.fields = null;
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
