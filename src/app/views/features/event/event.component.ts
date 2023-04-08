import { Component } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

interface employee_name {
  name: string;
}

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent {
  employee_name: employee_name[] = [];
  options: any;
  //建立formgroup表單
  event_form: FormGroup;
  currentevent!: any;
  constructor(private fb: FormBuilder) {
    this.event_form = this.fb.group({
      subject: ['', [Validators.required]],
      assigned_to: ['', [Validators.required]],
      location: ['', [Validators.required]],
      all_day_event: [false, [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
    });
  }
  ngOnInit() {
    this.employee_name = [
      { name: '123' },
      { name: '李小名' },
      { name: '李小名' },
    ]
    this.options = {
      plugins: [
        interactionPlugin,
        dayGridPlugin,
        timeGridPlugin,
        listPlugin,
      ],
      initialView: 'timeGridWeek',//日曆面板是否顯示以甚麼為單位的日期
      selectable: false, //是否可以選取多個日期
      selectOverlap: true, //日期是否可以被重複選中多次
      //eventClick: this.handleEventClick.bind(this), // 點擊每個日期要做什麼
      //select: this.handleDateSelect.bind(this), // 选中每个日期时调用的方法
      //eventsSet: this.handleEvents.bind(this), // 傳给後端進行保存
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
        { title: 'event 1', date: '2023-04-31T16:00:00' },
        { title: 'event 2', date: '2023-04-30' },
        { title: 'event 3', date: '2023-04-29' },
        { title: 'event 4', date: '2023-04-28' },
        { title: 'event 5', date: '2023-04-29' },
        { title: 'event 6', date: '2023-04-27' },
        { title: 'event 7', date: '2023-04-26' },
        { title: 'event 8', date: '2023-04-25T6:00:00' },
        { title: 'event 9', date: '2023-04-24' },
      ],
      //點選日期開啟新增事件
      dateClick: () => {
        console.log("DATE CLICKED !!!");
        this.showDialog('add')
      },
      //點選事件開啟編輯事件
      eventClick: (info: any) => {
        this.showDialog('edit',info.event)
        console.log(info.event);
      },
    };
  }
  visible: boolean = false;
  dialogHeader!: string;
  showDialog(type: string, event?: any) {
    this.dialogHeader = type === 'edit' ? '編輯日曆事件' : '新增日曆事件';
    this.visible = true;
    if (event) {
      this.currentevent = event;
      this.event_form.patchValue({
        title: event.title,
        start: event.start,
        end: event.end,
        allDay: event.allDay
      });
    } else {
      this.currentevent = null;
      this.event_form.reset();
    }
  }
}

