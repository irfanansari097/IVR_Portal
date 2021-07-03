import { DecimalPipe } from '@angular/common';
import { Component, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { Store } from 'redux';
import { Observable } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { AppState, IvrServiceDto } from 'src/app/store/app.state';
import { AppStore } from 'src/app/store/app.store';
import { NgbdSortableHeader, SortEvent } from './sortable.directive';
import { UploadivrcontentsService } from './uploadivrcontents.service';


@Component({
  selector: 'app-uploadivrcontents',
  templateUrl: './uploadivrcontents.component.html',
  styleUrls: ['./uploadivrcontents.component.scss'],
  providers: [UploadivrcontentsService, DecimalPipe]
})
export class UploadivrcontentsComponent implements OnInit {

  categories = [{ "id": "1", "name": "Basic" }, { "id": "2", "name": "Advance" }];
  showbasic = true;
  serviceid: string = "";
  adduploadIvrForm: FormGroup;
  //table work
  users$: Observable<string[]>;
  total$: Observable<number>;
  focus24;

  audiofile = null;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  modalRef: BsModalRef;
  @ViewChild('myModalAdd') myModalAdd: ModalDirective;
  @ViewChild('myModalinfo') myModalinfo: ModalDirective;
  @ViewChild('myModalconfirm') myModalconfirm: ModalDirective;
  myModalinform: string = "";
  datePickerValue : Date = new Date();
  audiofilelabel = "Choose Audio file";

  userCopy: IvrServiceDto = { serviceid: "", servicedesc: "", lessonid: "" };
  selectedcategory: IvrServiceDto;

  constructor(private modalService: BsModalService, public appservice: AppService, @Inject(AppStore) public store: Store<AppState>, public service: UploadivrcontentsService) {
    //table work
    this.users$ = service.users$;
    this.total$ = service.total$;


    //table work
    try {
      this.store.subscribe(() => this.updateState());

      //this.appservice.getUsers();     
    } catch (error) {
      throw new Error("Authguard::contructor Exception :" + error);

    }
  }

  updateState() {
    try {
      this.setDefaultValues();

    } catch (error) {
      throw new Error("ManagecpuserComponent::updateState Exception :" + error);
    }
  }

  ngOnInit(): void {
    this.adduploadIvrForm = new FormGroup({
      categoryid: new FormControl(""),
      lessonid: new FormControl(""),
      activedate: new FormControl(""),
      audio: new FormControl("")
    });
  }

  get categoryid() { return this.adduploadIvrForm.get('categoryid'); }
  get lessonid() { return this.adduploadIvrForm.get('lessonid'); }
  get activedate() { return this.adduploadIvrForm.get('activedate'); }
  get audio() { return this.adduploadIvrForm.get('audio'); }


  setDefaultValues() {
    this.adduploadIvrForm.reset();
    this.adduploadIvrForm.patchValue(
      {
        categoryid: (this.categories.length > 0) ? this.categories[0].id : "",
        lessonid: "",
        activedate: new Date().toDateString().substring(4),
      }

    );
    this.audiofilelabel = "Choose Audio file";
    this.showbasic = true;
  }

  onAdd(inService: string) {
    this.setDefaultValues();

    this.serviceid = inService;
    this.myModalAdd.show();
  }

  onSubmit() {
    if (this.adduploadIvrForm.valid) {
      let fromdatestring = this.getFormattedDateString(this.activedate.value);

      let ivrserviceadd: IvrServiceDto = {
        serviceid: this.serviceid,
        categoryid: (this.categoryid.value === '1') ? "Basic" : "Advance",
        lessonid: (this.lessonid.value === '') ? '0' : this.lessonid.value,
        activedate: fromdatestring,
        status: "A",
        contentname: this.audiofile.name,
        path: this.audiofile.name,
        modifydate: fromdatestring
      }

      const formData: FormData = new FormData();
      formData.append('ivrcontent', JSON.stringify(ivrserviceadd));
      formData.append('uploadfile', this.audiofile, this.audiofile.name);

      this.appservice.addIVRContent(formData, (result) => {
        this.myModalAdd.hide();
        if (result) {
          this.setDefaultValues();
        }
        this.myModalinform = (result) ? "IVR Content added successfully" : "Error in adding IVR content ";
        this.myModalinfo.show();
      });
    }
  }

  handleFileInput(event) {
    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;

    this.audiofile = files[0];
    this.audiofilelabel = this.audiofile.name;

  }

  getFormattedDateString(value: Date) {
    let datestring = "";
    if (value !== null) {
      datestring = new Date().toISOString().substring(0, 19);
    }
    else {
      datestring = value.toISOString().substring(0, 19);
    }


    datestring = datestring.replace("T", " ");


    return datestring;

  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  onChange(event) {
    this.showbasic = (event.target.value === "1") ? true : false;
  }

}
