import {Component, ViewChild} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Calendar} from 'primeng/calendar';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent {
  @ViewChild('fullstartDate') fullstartDate!: Calendar;
  @ViewChild('startDate') startDate!: Calendar;
  @ViewChild('endDate') endDate!: Calendar;
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

  constructor(private fb: FormBuilder) {
    this.event_form = this.fb.group({
      subject: ['', [Validators.required]],
      main: [[], [Validators.required]],
      member: [[]],
      location: [''],
      account_name: [''],
      contact: [''],
      allday: [false],
      fullstartDate: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      type: ['', [Validators.required]],
    });
    //驗證日期是否有效
    if (this.event_form.controls['start_date'].value > this.event_form.controls['end_date'].value) {
      this.event_form.controls['end_date'].setErrors({'incorrect': true});
    }
  }

  ngOnInit() {
    // 判斷全天日期是否有被選取
    // const alldayControl = this.event_form.get('allday');
    // if (alldayControl) {
    //   alldayControl.valueChanges.subscribe(value => {
    //     const startDateControl = this.event_form.get('start_date');
    //     const endDateControl = this.event_form.get('end_date');
    //     if (startDateControl && endDateControl) {
    //       // 轉換為 Calendar 類型
    //       const startDateCalendar = startDateControl as unknown as Calendar;
    //       const endDateCalendar = endDateControl as unknown as Calendar;
    //       if (value) {
    //         // 如果 checkbox 被選取，設置日期格式為 yy-mm-dd
    //         startDateCalendar.dateFormat = 'yy-mm-dd';
    //       } else {
    //         // 如果 checkbox 沒有被選取，設置日期格式為 yy-mm-dd hh:mm:ss
    //         startDateCalendar.dateFormat = 'yy-mm-dd hh:mm:ss';
    //         endDateCalendar.dateFormat = 'yy-mm-dd hh:mm:ss';
    //       }
    //     }
    //   });
    // }
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
        //this.newDialog();
        this.showDialog('add');
      },
      //點選事件開啟編輯事件
      eventClick: (info: any) => {
        this.showDialog('edit', info.event)
        console.log("title: " + info.event.title + "/" + " main: " + info.event.extendedProps.main + "/" + " member: " + info.event.extendedProps.member + "/" + " start: " + info.event.start + "/" + " end: " + info.event.end + "/" + " allday: "
          + info.event.allDay + "/" + " type: " + info.event.extendedProps.type);
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
    if (event && event.main) {
      this.event_form.setValue({
        main: event.extendedProps.main.split(',')?.map((name: string) => ({name})),
        member: event.extendedProps.member.split(',')?.map((name: string) => ({name})),
      });
    }
    if (event) {
      this.event_form.patchValue({
        subject: event.title,
        main: event.extendedProps.main,
        member: event.extendedProps.member,
        allday: event.allDay,
        start_date: event.start,
        end_date: event.end,
        type: event.extendedProps.type,
      });
      this.showedit = true;
    } else {
      this.event_form.reset();
      this.showedit = false;
    }
  }

//類型選擇變化
  typeValue(event: any): void {
    const typeValue = this.type.find((s: { code: any; }) => s.code === event.value.code);
    console.log(event.value.code, typeValue.name);
  }

}

