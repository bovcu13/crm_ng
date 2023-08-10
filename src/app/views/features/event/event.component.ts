import {Component, ElementRef} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpApiService} from "../../../api/http-api.service";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent {
  minDate: Date; // 最早時間，午夜12時
  maxDate: any; // 最晚時間，晚間11點59分
  //類型dropdown值
  type: any[] = [
    {
      "name": "緊急事件",
      "code": "urgent"
    },
    {
      "name": "客戶拜訪",
      "code": "comster visition"
    },
    {
      "name": "會議",
      "code": "meeting."
    },
    {
      "name": "電話",
      "code": "call"
    },
    {
      "name": "研討會",
      "code": "seminar"
    }
    ,
    {
      "name": "行銷",
      "code": "marketing"
    }
    ,
    {
      "name": "年度拜訪",
      "code": "annual visit"
    },
    {
      "name": "其他",
      "code": "other"
    }]
  options: any;
  //建立formgroup表單
  event_form: FormGroup;

  constructor(private fb: FormBuilder, private elementRef: ElementRef, private HttpApi: HttpApiService) {
    this.getAllEventRequest()
    this.getAllUserSelection()
    this.getAllAccountSelection()
    this.getAllContactSelection()
    this.getAllContactRequest()
    this.event_form = this.fb.group({
      subject: ['', [Validators.required]],
      main_name: [[], [Validators.required]],
      attendee_name: [[]],
      location: [''],
      account_name: [''],
      contact: [''],
      allday: [false],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      type: ['', [Validators.required]],
      description: [''],
      created_at: [''],
      updated_at: [''],
      created_by: [''],
      updated_by: [''],
    });
    // 設定最小日期為今天
    this.minDate = new Date();
  }

  // 當選擇日期後，設定最大日期為選擇日期當天的晚間11點59分
  onDateSelect(event: string | number | Date) {
    const selectedDate = new Date(event);
    this.maxDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59);
  }

  ngOnInit() {
    //日曆控制選項
    this.options = {
      plugins: [
        interactionPlugin,
        dayGridPlugin,
        timeGridPlugin,
        listPlugin,
      ],
      initialView: 'dayGridMonth',//日曆面板是否顯示以甚麼為單位的日期
      selectable: false, //是否可以選取多個日期
      selectOverlap: true, //日期是否可以被重複選中多次
      weekends: true, //日曆面板中是否顯示周末,一開始為不顯示
      //initialDate: 2023-03-31 //畫面一開始會顯示的日期
      headerToolbar: {// 日曆表頭部分
        left: 'today',
        center: 'prev,title,next',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      editable: false,// 是否可以進行拖拽、修改
      selectMirror: true,
      dayMaxEvents: true,
      handleWindowResize: true, //隨瀏覽器窗口大小變化
      // events: [
      //   {
      //     title: '緊急事件',
      //     main: [{"name": "test1"}, {'name': "test2"}],
      //     member: [{"name": "1"}, {'name': "3"}],
      //     start: '2023-05-01T06:30:00',
      //     end: '2023-05-01T08:30:00',
      //     allDay: false,
      //     backgroundColor: 'red',
      //     type: '電話',
      //   },
      //   {
      //     title: '客戶拜訪', main: [{"name": "123456"}, {'name': "王大天"}],
      //     member: [{"name": "6"}, {'name': "4"}], date: '2023-05-03', allDay: true, backgroundColor: 'orange',
      //     type: '客戶拜訪', textColor: 'black',
      //   },
      //   {
      //     title: '電話', main: [{"name": "李小名"}, {'name': "王大天"}],
      //     member: [{"name": "2"}], date: '2023-05-09', allDay: true, backgroundColor: 'burlywood', type: '電話',
      //     textColor: 'black'
      //   },
      //   {
      //     title: '會議',
      //     main: [{"name": "李小名"}, {'name': "test"}],
      //     member: [{"name": "2"}, {'name': "4"}],
      //     start: '2023-05-04T14:30:00',
      //     end: '2023-05-04T16:30:00',
      //     allDay: false,
      //     backgroundColor: 'green',
      //     type: '會議',
      //     textColor: 'black'
      //   },
      //   {
      //     title: '研討會',
      //     main: [{"name": "123456"}, {'name': "test3"}],
      //     member: [{"name": "5"}, {'name': "4"}],
      //     start: '2023-05-25T19:00:00',
      //     end: '2023-05-26T21:30:00',
      //     allDay: false,
      //     backgroundColor: 'deepskyblue', type: '研討會', textColor: 'black'
      //   },
      //   {
      //     title: '行銷',
      //     main: [{'name': "李小名"}, {'name': "王大天"}],
      //     member: [{"name": "6"}, {'name': "4"}],
      //     start: '2023-05-06T13:30:00',
      //     end: '2023-05-07T15:10:00',
      //     allDay: false,
      //     backgroundColor: 'pink', type: '行銷', textColor: 'black'
      //   },
      //   {
      //     title: '年度拜訪',
      //     main: [{'name': "test1"}, {'name': "王大天"}],
      //     member: [{"name": "6"}],
      //     start: '2023-05-17T09:30:00',
      //     end: '2023-05-18T10:30:00',
      //     allDay: false,
      //     backgroundColor: 'plum', type: '年度拜訪', textColor: 'black'
      //   },
      //   {
      //     title: '會議',
      //     main: [{"name": "123456"}, {'name': "test1"}],
      //     member: [{"name": "1"}, {'name': "3"}],
      //     start: '2023-05-08T16:30:00',
      //     end: '2023-05-08T17:00:00',
      //     allDay: false,
      //     backgroundColor: 'deepblue', type: '會議', textColor: 'black'
      //   },
      //   {
      //     title: '客戶拜訪',
      //     main: [{"name": "test"}, {'name': "test1"}],
      //     member: [{"name": "6"}, {'name': "3"}],
      //     start: '2023-05-19T10:30:00',
      //     end: '2023-05-19T12:00:00',
      //     allDay: false,
      //     backgroundColor: 'orange', type: '客戶拜訪', textColor: 'black'
      //   },
      // ],
      //點選日期開啟新增事件
      dateClick: () => {
        console.log("DATE CLICKED !!!");
        this.showDialog('add');
        const titleElement = this.elementRef.nativeElement.querySelector('.fc-toolbar-title');
        if (titleElement) {
          const title = titleElement.innerText;
          console.log('Title:', title);
        }
      },
      //點選事件開啟編輯事件
      eventClick: (info: any) => {
        this.showDialog('edit', info.event)
      },
    };
  }

//新增編輯日曆事件dialog控制項
  visible: boolean = false;
  dialogHeader!: string;
  showedit = true;//判斷是否dialog為新增與編輯
  showDialog(type: string, event ?: any) {
    this.dialogHeader = type === 'edit' ? '編輯日曆事件' : '新增日曆事件';
    this.visible = true;
    if (event) {
      this.event_form.patchValue({
        subject: event.title,
        main_name: event.extendedProps.mains,
        attendee_name: event.extendedProps.attendees,
        allday: event.allDay,
        start_date: new Date((event.start)),
        end_date: new Date((event.end)),
        contact: event.extendedProps.contacts,
        // type: this.type.find((s: { name: any; }) => s.name === event.extendedProps.type.status),
        description: event.extendedProps.description,
        location: event.extendedProps.location,
        created_at: event.extendedProps.created_at,
        created_by: event.extendedProps.created_by,
        updated_by: event.extendedProps.updated_by,
        updated_at: event.extendedProps.updated_at,
      });
      console.log(event)
      this.showedit = true;
    } else {
      this.event_form.reset();
      this.showedit = false;
    }
  }

  eventsearch: any;
  GetAllEvent: any[] = [];

  //取得所有日曆事件
  getAllEventRequest() {
    this.HttpApi.getAllEventRequest(this.eventsearch, 1).subscribe({
      next: res => {
        this.GetAllEvent = res.body.events
        this.options.events = res.body.events.map(
          (evt: {
            start_date: any;
            subject: string;
            type: string;
            description: any;
            end_date: any;
            is_whole: boolean;
            account_id: any;
            location: any;
            created_by: any;
            created_at: any;
            updated_at: any;
            updated_by: any;
            mains: any;
            attendees: any;
            contacts: any;
          }) => {
            return {
              title: evt.subject,
              start: evt.start_date,
              end: evt.end_date,
              description: evt.description,
              allDay: evt.is_whole,
              account_id: evt.account_id,
              location: evt.location,
              created_by: evt.created_by,
              created_at: evt.created_at,
              updated_at: evt.updated_at,
              updated_by: evt.updated_by,
              mains: evt.mains,
              attendees: evt.attendees,
              contacts: evt.contacts
            }
          })
        console.log(this.GetAllEvent)
        console.log(this.options.events)
      },
      error: error => {
        console.log(error);
      }
    });
  }

  search: string = '';  // 搜尋關鍵字
  getAllUserSelection(): void {
    this.HttpApi.getAllUserSelection().subscribe({
      next: (res) => {
        this.GetAllMain = res.body.users.map((users: any) => {
          return {
            main_name: users.name,
            main_id: users.user_id,
          };
        });
        this.GetAllAttendee = res.body.users.map((users: any) => {
          return {
            attendee_name: users.name,
            attendee_id: users.user_id,
          };
        });
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  //新增一筆 日曆事件
  postEventRequest() {
    let body = {
      // salesman_id: "eb6751fe-ba8d-44f6-a92f-e2efea61793a",

      // creater: "eb6751fe-ba8d-44f6-a92f-e2efea61793a"
    }
    this.HttpApi.postEventRequest(body).subscribe({
      next: Request => {
        console.log(Request)
        this.getAllEventRequest()
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  GetAllAccount: any[] = []

  getAllAccountSelection() {
    this.HttpApi.getAllAccountSelection().subscribe({
      next: res => {
        this.GetAllAccount = res.body.accounts
        console.log(this.GetAllAccount)
      },
      error: error => {
        console.log(error);
      }
    });
  }

  GetAllContact: any[] = []
  getAllContactSelection() {
    // this.HttpApi.getAllContactSelection().subscribe({
    //   next: res => {
    //     this.GetAllContact = res.body.contacts
    //     console.log(res.body.contacts)
    //   },
    //   error: error => {
    //     console.log(error);
    //   }
    // });
  }

  ContactSearch: any;
  getAllContactRequest(){
    this.HttpApi.getAllContactRequest(this.ContactSearch,1).subscribe({
      next: res => {
        this.GetAllContact = res.body.contacts.map((contact: any) => {
          return {
            contact_name: contact.name,
            contact_id: contact.contact_id,
          };
        });
        console.log(this.GetAllContact)
      },
      error: error => {
        console.log(error);
      }
    });
  }
//類型選擇變化
  typeValue(event: any): void {
    const typeValue = this.type.find((s: { code: any; }) => s.code === event.value.code);
    console.log(event.value.code, typeValue.name);
  }

  //選擇主要人員的值
  SelectMain: any[] = []
  GetAllMain: any[] = []

  MultiSelectMain(event: any): void {
    this.SelectMain = event.value
    console.log('已經選擇的 Main: ', this.SelectMain);
    this.removeDuplicatesFromAttendee();
  }

  //選擇主要人員的值
  SelectAttendee: any[] = []
  GetAllAttendee: any[] = []

  MultiSelectAttendee(event: any): void {
    this.SelectAttendee = event.value
    console.log('已經選擇的 Attendee: ', this.SelectAttendee);
    this.removeDuplicatesFromMain();
  }

  // 刪除主要人員中與參加成員重複的值
  removeDuplicatesFromMain(): void {
    this.GetAllMain = this.GetAllMain.filter(user => !this.SelectAttendee.includes(user));
    console.log('可以選擇的 Main: ' + JSON.stringify(this.GetAllMain))
  }

  // 刪除參加成員中與主要人員重複的值
  removeDuplicatesFromAttendee(): void {
    this.GetAllAttendee = this.GetAllAttendee.filter(user => !this.SelectMain.includes(user));
    console.log('可以選擇的 Attendee: ' + JSON.stringify(this.GetAllAttendee))
  }

// 當清空主要人員時的處理函數
  onClearMain(): void {
    this.SelectMain = []; // 清空主要人員的選擇
    this.getAllUserSelection()
    this.removeDuplicatesFromMain(); // 移除重複的選項
  }

// 當清空參加成員時的處理函數
  onClearAttendee(): void {
    this.SelectAttendee = []; // 清空參加成員的選擇
    this.getAllUserSelection()
    this.removeDuplicatesFromAttendee(); // 移除重複的選項
  }

}

