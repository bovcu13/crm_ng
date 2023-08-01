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
  //主辦人dropdown值
  main: any[] = [
    {"name": "王大天",},
    {"name": '李小名'},
    {"name": '123456'},
    {"name": 'test1'},
    {"name": 'test2'},
    {"name": 'test3'},
  ];
  //參加成員dropdown值
  member: any[] = [
    {"name": '1'},
    {"name": '2'},
    {"name": '3'},
    {"name": '4'},
    {"name": '5'},
    {"name": '6'},
  ];
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

  constructor(private fb: FormBuilder,private elementRef: ElementRef, private HttpApi: HttpApiService) {
    this.getAllEventRequest()
    this.getAllUserRequest()
    this.event_form = this.fb.group({
      subject: ['', [Validators.required]],
      main: [[], [Validators.required]],
      main_name: [[], [Validators.required]],
      attendee_name: [[]],
      member: [[]],
      location: [''],
      account_name: [''],
      contact: [''],
      allday: [false],
      fullstartDate: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      type: ['', [Validators.required]],
      description: [''],
      created_at: [''],
      updated_at: [''],
      created_by: [''],
      updated_by: [''],
    });
    const today = new Date();
    // 設定最小日期為今天
    this.minDate = today;
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
      events: [
        {
          title: '緊急事件',
          main: [{"name": "test1"}, {'name': "test2"}],
          member: [{"name": "1"}, {'name': "3"}],
          start: '2023-05-01T06:30:00',
          end: '2023-05-01T08:30:00',
          allDay: false,
          backgroundColor: 'red',
          type: '電話',
        },
        {
          title: '客戶拜訪', main: [{"name": "123456"}, {'name': "王大天"}],
          member: [{"name": "6"}, {'name': "4"}], date: '2023-05-03', allDay: true, backgroundColor: 'orange',
          type: '客戶拜訪', textColor: 'black',
        },
        {
          title: '電話', main: [{"name": "李小名"}, {'name': "王大天"}],
          member: [{"name": "2"}], date: '2023-05-09', allDay: true, backgroundColor: 'burlywood', type: '電話',
          textColor: 'black'
        },
        {
          title: '會議',
          main: [{"name": "李小名"}, {'name': "test"}],
          member: [{"name": "2"}, {'name': "4"}],
          start: '2023-05-04T14:30:00',
          end: '2023-05-04T16:30:00',
          allDay: false,
          backgroundColor: 'green',
          type: '會議',
          textColor: 'black'
        },
        {
          title: '研討會',
          main: [{"name": "123456"}, {'name': "test3"}],
          member: [{"name": "5"}, {'name': "4"}],
          start: '2023-05-25T19:00:00',
          end: '2023-05-26T21:30:00',
          allDay: false,
          backgroundColor: 'deepskyblue', type: '研討會', textColor: 'black'
        },
        {
          title: '行銷',
          main: [{'name': "李小名"}, {'name': "王大天"}],
          member: [{"name": "6"}, {'name': "4"}],
          start: '2023-05-06T13:30:00',
          end: '2023-05-07T15:10:00',
          allDay: false,
          backgroundColor: 'pink', type: '行銷', textColor: 'black'
        },
        {
          title: '年度拜訪',
          main: [{'name': "test1"}, {'name': "王大天"}],
          member: [{"name": "6"}],
          start: '2023-05-17T09:30:00',
          end: '2023-05-18T10:30:00',
          allDay: false,
          backgroundColor: 'plum', type: '年度拜訪', textColor: 'black'
        },
        {
          title: '會議',
          main: [{"name": "123456"}, {'name': "test1"}],
          member: [{"name": "1"}, {'name': "3"}],
          start: '2023-05-08T16:30:00',
          end: '2023-05-08T17:00:00',
          allDay: false,
          backgroundColor: 'deepblue', type: '會議', textColor: 'black'
        },
        {
          title: '客戶拜訪',
          main: [{"name": "test"}, {'name': "test1"}],
          member: [{"name": "6"}, {'name': "3"}],
          start: '2023-05-19T10:30:00',
          end: '2023-05-19T12:00:00',
          allDay: false,
          backgroundColor: 'orange', type: '客戶拜訪', textColor: 'black'
        },
      ],
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
        main: event.extendedProps.main,
        member: event.extendedProps.member,
        allday: event.allDay,
        start_date : new Date((event.start).getTime() - 8 * 60 * 60 * 1000),
        // end_date : new Date((event.end).getTime() - 8 * 60 * 60 * 1000),
        type: event.extendedProps.type,
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
            (evt: { start_date: any; subject: string; type: string; description: any; end_date: any;is_whole: boolean;account_name: any;location: any; created_by: any; created_at: any; updated_at: any; updated_by: any;
            }) => {
            return { title: evt.subject ,start: evt.start_date, end: evt.end_date, description: evt.description,allDay: evt.is_whole,account_name: evt.account_name ,location: evt.location ,created_by: evt.created_by ,
              created_at: evt.created_at, updated_at: evt.updated_at, updated_by: evt.updated_by }
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
  GetAllUser : any[] = []
  getAllUserRequest(): void{
    this.HttpApi.getAllUserRequest(this.search, 1).subscribe({
      next: (res) => {
        this.GetAllUser = res.body.users.map((users: any) => {
          return {
            label: users.name,
            value: users.user_id,
          };
        });
        this.GetAllAttendee = this.GetAllUser
        this.GetAllMain = this.GetAllUser
        console.log(this.GetAllUser)
      },
      error: (error) => {
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
  SelectMain : any[]=[]
  GetAllMain : any[] = []
  MultiSelectMain(event: any): void {
    this.SelectMain = event.value
    console.log('Selected Main: ', this.SelectMain);
    this.removeDuplicatesFromAttendee();
  }
  //選擇主要人員的值
  SelectAttendee : any[]=[]
  GetAllAttendee : any[] = []
  MultiSelectAttendee(event: any): void {
    this.SelectAttendee = event.value
    console.log('Selected Attendee: ', this.SelectAttendee);
    this.removeDuplicatesFromMain();
  }

// 刪除主要人員中與參加成員重複的值
  removeDuplicatesFromMain(): void {
    this.GetAllMain = this.GetAllMain.filter(user => !this.SelectAttendee.includes(user));
    // 重新載入參加成員的下拉選單選項，以包含完整的選項（包括剛選擇的主要人員）
    this.GetAllAttendee = this.GetAllAttendee.concat(this.SelectMain.filter(user => !this.GetAllAttendee.includes(user)));
  }

// 刪除參加成員中與主要人員重複的值
  removeDuplicatesFromAttendee(): void {
    this.GetAllAttendee = this.GetAllAttendee.filter(user => !this.SelectMain.includes(user));
    // 重新載入主要人員的下拉選單選項，以包含完整的選項（包括剛選擇的參加成員）
    this.GetAllMain = this.GetAllMain.concat(this.SelectAttendee.filter(user => !this.GetAllMain.includes(user)));
  }
}

