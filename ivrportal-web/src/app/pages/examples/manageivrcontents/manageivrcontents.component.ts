import { DecimalPipe } from '@angular/common';
import { Component, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { Store } from 'redux';
import { Observable } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { AppState, IvrServiceDto } from 'src/app/store/app.state';
import { AppStore } from 'src/app/store/app.store';
import { ManageivrcontentsService } from './manageivrcontents.service';
import { NgbdSortableHeader, SortEvent } from './sortable.directive';


@Component({
  selector: 'app-manageivrcontents',
  templateUrl: './manageivrcontents.component.html',
  styleUrls: ['./manageivrcontents.component.scss'],
  providers: [ManageivrcontentsService, DecimalPipe]
})
export class ManageivrcontentsComponent implements OnInit {

  categories = [{ "id": "1", "name": "Basic" }, { "id": "2", "name": "Advance" }];
  audiofilestream = null;
  audiofilelabel = "Choose Audio file";
  focus5;
  focus6;
  focus33;
  focus24;
  focus18;
  selectid: string = "";
  showbasic = true;

  manageIvrForm: FormGroup;
  //table work
  learnenglishes$: Observable<IvrServiceDto[]>;
  total$: Observable<number>;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  modalRef: BsModalRef;
  @ViewChild('myModaledit') myModaledit: ModalDirective;
  @ViewChild('myModalinfo') myModalinfo: ModalDirective;
  @ViewChild('myModalconfirm') myModalconfirm: ModalDirective;

  myModalinform: string = "";
  userCopy: IvrServiceDto = { serviceid: "", categoryid: "", lessonid: "", activedate: "", contentname: "", modifydate: "" };

  selectedcategory: IvrServiceDto;

  services = [];
  constructor(private modalService: BsModalService, public appservice: AppService, @Inject(AppStore) public store: Store<AppState>, public service: ManageivrcontentsService) {


    //table work
    this.learnenglishes$ = service.users$;
    this.total$ = service.total$;
    // this.myModalinform = "";
    //table work
    try {
      this.store.subscribe(() => this.updateState());
    } catch (error) {
      throw new Error("Authguard::contructor Exception :" + error);

    }

  }

  updateState() {
    try {
      this.setDefaultValues();

    } catch (error) {
      throw new Error("manageIvrcotents::updateState Exception :" + error);
    }
  }

  ngOnInit(): void {
    this.manageIvrForm = new FormGroup({
      serviceid: new FormControl(""),
      contentname: new FormControl(""),
      categoryid: new FormControl(""),
      lessonid: new FormControl(""),
      activedate: new FormControl(""),
      modifydate: new FormControl(""),
      audiofile: new FormControl("")
    });
  }

  get serviceid() { return this.manageIvrForm.get('serviceid'); }
  get categoryid() { return this.manageIvrForm.get('categoryid'); }
  get lessonid() { return this.manageIvrForm.get('lessonid'); }
  get activedate() { return this.manageIvrForm.get('activedate'); }
  get contentname() { return this.manageIvrForm.get('contentname'); }
  get modifydate() { return this.manageIvrForm.get('modifydate'); }
  get audiofile() { return this.manageIvrForm.get('audiofile'); }



  onEdit(inService: IvrServiceDto) {
    this.selectid = inService.id;
    //update contentCopy
    this.manageIvrForm.patchValue({
      serviceid: inService.serviceid,
      categoryid: inService.categoryid === "Basic" ? "1" : "2",
      lessonid: inService.lessonid,
      activedate: inService.activedate,
      contentname: inService.contentname,
      modifydate: new Date(inService.modifydate),
    });

    this.audiofilelabel = inService.path;
    this.onChange();
    this.myModaledit.show();
  }

  getFormattedDateString(value: Date) {
    let datestring = "";  
      

    if (value === null) {
      datestring = new Date().toISOString().substring(0, 19);
    }
    else if (value instanceof Date){
      datestring = value.toISOString().substring(0, 19);
    }
    else{
      datestring = value;
    }

    datestring = datestring.replace("T", " ");
    return datestring;
  }

    onSave() {

      let fromdatestring = this.getFormattedDateString(this.activedate.value);
      let todatestring = this.getFormattedDateString(this.modifydate.value);

      let ivrserviceupdate: IvrServiceDto = {
        id : this.selectid,
        serviceid: this.serviceid.value,
        categoryid: (this.categoryid.value === '1') ? "Basic" : "Advance",
        lessonid: (this.lessonid.value === '') ? '0' : this.lessonid.value,
        activedate: fromdatestring,
        status: "A",
        contentname: this.contentname.value,
        path: this.contentname.value,
        modifydate: todatestring
      }

      const formData: FormData = new FormData();
      formData.append('ivrcontent', JSON.stringify(ivrserviceupdate));
      if (this.audiofilestream !== null) {
        formData.append('uploadfile', this.audiofilestream, this.audiofilestream.name);
      }


      this.appservice.updateIVRContent(formData, (result) => {
        this.myModaledit.hide();
        this.myModalinform = (result) ? "IVR Content updated successfully" : "Error in updating IVR Content";
        this.myModalinfo.show();
      });

    }
  

    setDefaultValues() {
      this.manageIvrForm.reset();
      this.manageIvrForm.patchValue(
        {
          serviceid: "",
          categoryid: "",
          lessonid: "",
          activedate: "",
          contentname: "",
          modifydate: ""
        }
      );
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

    onDelete() {
      this.myModalconfirm.hide();

      this.appservice.deleteIVRContent(this.selectedcategory.id, (result) => {
        this.myModalinform = (result) ? "IVR content deleted successfully" : "Error in deleting IVR content";
        this.myModalinfo.show();
      });
    }

    showdialog(english: IvrServiceDto) {
      this.selectedcategory = english;
      this.myModalconfirm.show();
    }

    handleFileInput(event, index) {
      let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
      let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
      let files: FileList = target.files;


      switch (index) {
        case 1:
          this.audiofilestream = files[0];
          this.audiofilelabel = this.audiofilestream.name;
          break;
        default:
          break;
      }
    }

    onChange() {      
      if (this.categoryid.value === '1') {
        this.lessonid.enable();
      }
      else {
        this.lessonid.disable();
      }

      // this.showbasic = (event.target.value === "1") ? true : false;
    }

  }
