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
  @ViewChild('startDate') startDate!: Calendar;
  @ViewChild('endDate') endDate!: Calendar;
  //指派對象dropdown值
  assigned_to: any[] = [
      {name: '123'},
      {name: '李小名'},
      {name: '李小名'},
  ];
  //類型dropdown值
  type: any[] = [
    {
      "name": "Email",
      "code": "email"
    },
    {
      "name": "Meeting",
      "code": "meeting."
    },
    {
      "name": "Call",
      "code": "call"
    },
    {
      "name": "Other",
      "code": "other"
    }]
  options: any;
  //建立formgroup表單
  event_form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.event_form = this.fb.group({
      subject: ['', [Validators.required]],
      assigned_to: ['', [Validators.required]],
      location: ['', [Validators.required]],
      allday: [false],
      all_date: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      type: [''],
    });
    //驗證日期是否有效
    if (this.event_form.controls['start_date'].value > this.event_form.controls['end_date'].value) {
      this.event_form.controls['end_date'].setErrors({'incorrect': true});
    }
  }

  ngOnInit() {
    // 判斷全天日期是否有被選取
    const alldayControl = this.event_form.get('allday');
    if (alldayControl) {
      alldayControl.valueChanges.subscribe(value => {
        const startDateControl = this.event_form.get('start_date');
        const endDateControl = this.event_form.get('end_date');
        if (startDateControl && endDateControl) {
          // 轉換為 Calendar 類型
          const startDateCalendar = startDateControl as unknown as Calendar;
          const endDateCalendar = endDateControl as unknown as Calendar;
          if (value) {
            // 如果 checkbox 被選取，設置日期格式為 yy-mm-dd
            startDateCalendar.dateFormat = 'yy-mm-dd';
          } else {
            // 如果 checkbox 沒有被選取，設置日期格式為 yy-mm-dd hh:mm:ss
            startDateCalendar.dateFormat = 'yy-mm-dd hh:mm:ss';
            endDateCalendar.dateFormat = 'yy-mm-dd hh:mm:ss';
          }
        }
      });
    }
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
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      editable: false,// 是否可以進行拖拽、修改
      selectMirror: true,
      dayMaxEvents: true,
      handleWindowResize: true, //隨瀏覽器窗口大小變化
      events: [
        {
          title: 'event 1',
          start: '2023-04-01T06:30:00',
          end: '2023-04-01T08:30:00',
          allDay: false,
          backgroundColor: 'red'
        },
        {title: 'event 2', date: '2023-04-03', allDay: true, backgroundColor: 'orange'},
        {title: 'event 3', date: '2023-04-09', allDay: true, backgroundColor: 'yellow'},
        {
          title: 'event 4',
          start: '2023-04-04T14:30:00',
          end: '2023-04-04T16:30:00',
          allDay: false,
          backgroundColor: 'green'
        },
        {
          title: 'event 5',
          start: '2023-04-25T19:00:00',
          end: '2023-04-26T21:30:00',
          allDay: false,
          backgroundColor: 'deepskyblue'
        },
        {
          title: 'event 6',
          start: '2023-04-06T13:30:00',
          end: '2023-04-07T15:10:00',
          allDay: false,
          backgroundColor: 'pink'
        },
        {
          title: 'event 7',
          start: '2023-04-17T09:30:00',
          end: '2023-04-18T10:30:00',
          allDay: false,
          backgroundColor: 'purple'
        },
        {
          title: 'event 8',
          start: '2023-04-08T16:30:00',
          end: '2023-04-08T17:00:00',
          allDay: false,
          backgroundColor: 'deepblue'
        },
        {
          title: 'event 9',
          start: '2023-04-19T10:30:00',
          end: '2023-04-19T12:00:00',
          allDay: false,
          backgroundColor: 'gray'
        },
      ],
      //點選日期開啟新增事件
      dateClick: () => {
        console.log("DATE CLICKED !!!");
        this.showDialog('add')
      },
      //點選事件開啟編輯事件
      eventClick: (info: any) => {
        //start_date = this.localToUtc(this.event_form.start_date),
        this.showDialog('edit', info.event)
        console.log("title: " + info.event.title + "/" + " start: " + info.event.start + "/" + " end: " + info.event.end + "/" + " allday: " + info.event.allDay);
      },
    };
  }

  //時間調整
  localToUtc(date: Date): Date {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() - 8, date.getMinutes(), date.getSeconds()));
  }
  //新增編輯日曆事件dialog控制項
  visible: boolean = false;
  dialogHeader!: string;
  showDialog(type: string, event?: any) {
    this.dialogHeader = type === 'edit' ? '編輯日曆事件' : '新增日曆事件';
    this.visible = true;
    if (event) {
      this.event_form.patchValue({
        subject: event.title,
        allday: event.allDay,
        start_date: event.start,
        end_date: event.end,
      });
    } else {
      this.event_form.reset();
    }
  }
  typeValue(event: any): void {
    const typeValue = this.type.find((s: { code: any; }) => s.code === event.value.code);
    console.log(event.value.code , typeValue.name);
  }
}

