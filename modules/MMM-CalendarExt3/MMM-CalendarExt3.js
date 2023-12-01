/* Global Log, Module, config */

const popoverSupported = (typeof HTMLElement !== 'undefined') ? HTMLElement.prototype.hasOwnProperty('popover') : false
if (!popoverSupported) console.info(`This browser doesn't support popover yet. Update your system.`)
const animationSupported = (typeof window !== 'undefined' && window?.mmVersion) ? +(window.mmVersion.split('.').join('')) >= 2250 : false
Module.register('MMM-CalendarExt3', {
  defaults: {
    mode: 'week', // or 'month', 'day'
    weekIndex: -1, // Which week from this week starts in a view. Ignored on mode 'month'
    dayIndex: -1,
    weeksInView: 3, //  How many weeks will be displayed. Ignored on mode 'month'
    instanceId: null,
    firstDayOfWeek: null, // 0: Sunday, 1: Monday
    minimalDaysOfNewYear: null, // When the first week of new year starts in your country.
    weekends: [], // or [0, 6]. 0: Sunday, 6: Saturday
    locale: null, // 'de' or 'en-US' or prefer array like ['en-CA', 'en-US', 'en']
    cellDateOptions: {
      month: 'short',
      day: 'numeric'
    },
    eventTimeOptions: {
      timeStyle: 'short'
    },
    headerWeekDayOptions: {
      weekday: 'long'
    },
    headerTitleOptions: {
      month: 'long'
    },
    calendarSet: [],
    maxEventLines: 5, // How many events will be shown in a day cell.
    fontSize: '18px',
    eventHeight: '22px',
    eventFilter: (ev) => { return true },
    eventSorter: null,
    eventTransformer: (ev) => { return ev },
    refreshInterval: 1000 * 60 * 10, // too frequent refresh. 10 minutes is enough.
    waitFetch: 1000 * 5,
    glanceTime: 1000 * 60, // deprecated, use refreshInterval instead.
    animationSpeed: 2000,
    useSymbol: true,
    displayLegend: false,
    useWeather: true,
    weatherLocationName: null,
    //notification: 'CALENDAR_EVENTS', /* reserved */

    manipulateDateCell: (cellDom, events) => { },
    weatherNotification: 'WEATHER_UPDATED',
    weatherPayload: (payload) => { return payload },
    eventNotification: 'CALENDAR_EVENTS',
    eventPayload: (payload) => { return payload },

    displayEndTime: false,
    displayWeatherTemp: false,

    popoverTemplate: './popover.html',
    popoverTimeout: 1000 * 30,
    popoverPeriodOptions: {
      dateStyle: 'short',
      timeStyle: 'short'
    },
    popoverDateOptions: {
      dateStyle: 'full',
    },

    displayCW: true,
    animateIn: 'fadeIn',
    animateOut: 'fadeOut',

    skipPassedEventToday: false,
    showMore: true,
    useIconify: true,

    useMarquee: false,
  },

  defaulNotifications: {
    weatherNotification: 'WEATHER_UPDATED',
    weatherPayload: (payload) => { return payload },
    eventNotification: 'CALENDAR_EVENTS',
    eventPayload: (payload) => { return payload },
  },

  getStyles: function () {
    let css = ['MMM-CalendarExt3.css']
    return css
  },

  getMoment: function() {
    let moment = (this.tempMoment) ? new Date(this.tempMoment.valueOf()) : new Date()
    switch (this.mode) {
      case 'day':
        moment = new Date(moment.getFullYear(), moment.getMonth(), moment.getDate() + this.stepIndex)
        break
      case 'month':
        moment = new Date(moment.getFullYear(), moment.getMonth() + this.stepIndex, 1)
        break
      case 'week':
      default:
        moment = new Date(moment.getFullYear(), moment.getMonth(), moment.getDate() + (7 * this.stepIndex))
    }
    return moment
  },

  start: function() {
    this.mode = (['day', 'month', 'week'].includes(this.config.mode)) ? this.config.mode : 'week'
    this.locale = Intl.getCanonicalLocales(this.config.locale ?? config.language )?.[0] ?? ''
    this.instanceId = this.config.instanceId ?? this.identifier
    this.weekIndex = (this.mode === 'month') ? 0 : this.config.weekIndex
    this.weeksInView = (this.mode === 'month') ? 6 : this.config.weeksInView
    this.dayIndex = (this.mode === 'day') ? this.config.dayIndex : 0
    this.stepIndex = 0
    this.fetchTimer = null
    this.refreshTimer = null
    this.tempMoment = null
    this.forecast = []
    this.eventPool = new Map()
    this.popoverTimer = null

    const calInfo = new Intl.Locale(this.locale)
    if (calInfo?.weekInfo) {
      this.config.firstDayOfWeek = (this.config.firstDayOfWeek !== null) ? this.config.firstDayOfWeek : (calInfo.weekInfo?.firstDay ?? 1)
      this.config.minimalDaysOfNewYear = (this.config.minimalDaysOfNewYear !== null) ? this.config.minimalDaysOfNewYear : (calInfo.weekInfo?.minimalDays ?? 4)
      this.config.weekends = ((Array.isArray(this.config.weekends) && this.config.weekends?.length) ? this.config.weekends : (calInfo.weekInfo?.weekend ?? [])).map(d => d % 7)
    }

    this.notifications = {
      weatherNotification: this.config.weatherNotification ?? this.defaulNotifications.weatherNotification,
      weatherPayload: (typeof this.config.weatherPayload === 'function') ? this.config.weatherPayload : this.defaulNotifications.weatherPayload,
      eventNotification: this.config.eventNotification ?? this.defaulNotifications.eventNotification,
      eventPayload: (typeof this.config.eventPayload === 'function') ? this.config.eventPayload : this.defaulNotifications.eventPayload,
    }

    this._ready = false

    let _moduleLoaded = new Promise((resolve, reject) => {
      import('/' + this.file('CX3_Shared/CX3_shared.mjs')).then((m) => {
        this.library = m
        this.library.initModule(this, config.language)
        if (this.config.useIconify) this.library.prepareIconify()
        resolve()
      }).catch((err) => {
        Log.error(err)
        reject(err)
      })
    })

    let _firstData = new Promise((resolve, reject) => {
      this._receiveFirstData = resolve
    })

    let _firstFetched = new Promise((resolve, reject) => {
      this._firstDataFetched = resolve
    })

    let _domCreated = new Promise((resolve, reject) => {
      this._domReady = resolve
    })

    Promise.allSettled([_moduleLoaded, _firstData, _domCreated]).then ((result) => {
      this._ready = true
      this.library.prepareMagic()
      let {payload, sender} = result[1].value
      this.fetch(payload, sender)
      this._firstDataFetched()
    })

    Promise.allSettled([_firstFetched]).then (() => {
      setTimeout(() => {
        this.updateAnimate()
      }, this.config.waitFetch)

    })
    /* append popover */
    if (popoverSupported) {
      this.preparePopover()
    }
  },

  preparePopover: function () {
    if (!popoverSupported) return
    if (document.getElementById('CX3_POPOVER')) return

    fetch(this.file(this.config.popoverTemplate)).then((response) => {
      return response.text()
    }).then((text) => {
      const template = new DOMParser().parseFromString(text, 'text/html').querySelector('#CX3_T_POPOVER').content.querySelector('.popover')
      const popover = document.importNode(template, true)
      popover.id = 'CX3_POPOVER'
      document.body.appendChild(popover)
      popover.ontoggle = (ev) => {
        if (this.popoverTimer) {
          clearTimeout(this.popoverTimer)
          this.popoverTimer = null
        }
        if (ev.newState === 'open') {
          this.popoverTimer = setTimeout(() => {
            try {
              popover.hidePopover()
              popover.querySelector('.container').innerHTML = ''
            } catch (e) {
              // do nothing
            }
          }, this.config.popoverTimeout)
        } else { // closed
          popover.querySelector('.container').innerHTML = ''
        }
      }
    }).catch((err) => {
      Log.error('[CX3]', err)
    })
  },

  dayPopover(cDom, events, config) {
    const popover = document.getElementById('CX3_POPOVER')
    if (!popover) return
    const container = popover.querySelector('.container')
    container.innerHTML = ''
    const ht = popover.querySelector('template#CX3_T_EVENTLIST').content.cloneNode(true)
    container.appendChild(document.importNode(ht, true))
    let header = container.querySelector('.header')
    header.innerHTML = new Intl.DateTimeFormat(this.locale, { dateStyle: 'full' }).formatToParts(new Date(+cDom.dataset.date))
    .reduce((prev, cur, curIndex, arr) => {
      prev = prev + `<span class="eventTimeParts ${cur.type} seq_${curIndex} ${cur.source}">${cur.value}</span>`
      return prev
    }, '')

    let list = container.querySelector('.list')
    list.innerHTML = ''
    const { renderEventAgenda, renderSymbol } = this.library
    const moment = new Date()
    events.forEach((e) => {
      pOption = (e.fullDayEvent) ? { dateStyle: 'short' } : { dateStyle: 'short', timeStyle: 'short' }

      const item = popover.querySelector('template#CX3_T_EVENTITEM').content.firstElementChild.cloneNode(true)
      item.style.setProperty('--calendarColor', e.color)
      item.classList.add('event')
      const symbol = item.querySelector('.symbol')
      renderSymbol(symbol, e, config)
      const time = item.querySelector('.time')
      time.innerHTML = new Intl.DateTimeFormat(this.locale, pOption).formatRangeToParts(new Date(+e.startDate), new Date(+e.endDate))
      .reduce((prev, cur, curIndex, arr) => {  
        prev = prev + `<span class="eventTimeParts ${cur.type} seq_${curIndex} ${cur.source}">${cur.value}</span>`
        return prev
      }, '')
      const title = item.querySelector('.title')
      title.innerHTML = e.title
      list.appendChild(item)
    })

    this.activatePopover(popover)
  },

  eventPopover: function (eDom) {
    const popover = document.getElementById('CX3_POPOVER')
    if (!popover) return
    const container = popover.querySelector('.container')
    container.innerHTML = ''
    const ht = popover.querySelector('template#CX3_T_EVENTDETAIL').content.cloneNode(true)
    container.appendChild(document.importNode(ht, true))
    let eSymbol = eDom.querySelector('.symbol').cloneNode(true)
    container.querySelector('.symbol').appendChild(eSymbol)
    let eTitle = eDom.querySelector('.title').cloneNode(true)
    container.querySelector('.title').appendChild(eTitle)
    let header = container.querySelector('.header')
    header.style.setProperty('--calendarColor', eDom.style.getPropertyValue('--calendarColor'))
    header.style.setProperty('--oppositeColor', eDom.style.getPropertyValue('--oppositeColor'))
    header.dataset.isFullday = eDom.dataset.fullDayEvent

    let criteria = container.querySelector('.criteria')
    criteria.innerHTML = ''
    const ps = ['location', 'description', 'calendar']
    ps.forEach((c) => {
      if (eDom.dataset[ c ]) {
        const ct = popover.querySelector('template#CX3_T_CRITERIA').content.firstElementChild.cloneNode(true)
        ct.querySelector('.name').innerHTML = c
        ct.querySelector('.value').innerHTML = eDom.dataset[ c ]
        criteria.appendChild(document.importNode(ct, true))
      }
    })

    let start = new Date(+(eDom.dataset.startDate))
    let end = new Date(+(eDom.dataset.endDate))
    const ct = popover.querySelector('template#CX3_T_CRITERIA').content.firstElementChild.cloneNode(true)
    const n = criteria.appendChild(document.importNode(ct, true))
    n.classList.add('period')
    n.querySelector('.name').innerHTML = 'period'
    pOption = (eDom.dataset.fullDayEvent === 'true') ? { dateStyle: 'short' } : { dateStyle: 'short', timeStyle: 'short' }
    n.querySelector('.value').innerHTML = new Intl.DateTimeFormat(this.locale, pOption).formatRangeToParts(start, end)
    .reduce((prev, cur, curIndex, arr) => {
      prev = prev + `<span class="eventTimeParts ${cur.type} seq_${curIndex} ${cur.source}">${cur.value}</span>`
      return prev
    }, '')
    this.activatePopover(popover)
  },

  activatePopover: function (popover) {
    let opened = document.querySelectorAll('[popover-opened]')
    for (const o of Array.from(opened)) {
      o.hidePopover()
    }
    popover.showPopover()
  },

  fetch: function(payload, sender) {
    this.storedEvents = this.library.regularizeEvents({
      storedEvents: this.storedEvents,
      eventPool: this.eventPool,
      payload,
      sender,
      config: this.config
    })
  },

  notificationReceived: function(notification, payload, sender) {
    if (notification === this.notifications.eventNotification) {
      let conveertedPayload = this.notifications.eventPayload(payload)
      if (this?.storedEvents?.length == 0 && payload.length > 0) {
        this._receiveFirstData({payload: conveertedPayload, sender})
      }
      if (this?.library?.loaded) {
        this.fetch(conveertedPayload, sender)
      } else {
        Log.warn('[CX3] Module is not prepared yet, wait a while.')
      }
    }

    if (notification === 'MODULE_DOM_CREATED') {
      this._domReady()
      const moduleContainer = document.querySelector(`#${this.identifier} .module-content`)
      const callback = (mutationsList, observer) => {
        for (let mutation of mutationsList) {
          const content = document.querySelector(`#${this.identifier} .module-content .CX3`)
          if (mutation.addedNodes.length > 0) this.updated(content)
        }
      }
      const MutationObserver = window.MutationObserver || window.WebKitMutationObserver
      const observer = new MutationObserver(callback)
      observer.observe(moduleContainer, { childList: true })
    }

    if (notification === 'CX3_MOVE_CALENDAR' || notification === 'CX3_GLANCE_CALENDAR') {
      if (notification === 'CX3_MOVE_CALENDAR') {
        Log.warn (`[DEPRECATED]'CX3_MOVE_CALENDAR' notification will be deprecated. Use 'CX3_GLANCE_CALENDAR' instead.`)
      }
      if (payload?.instanceId === this.config.instanceId || !payload?.instanceId) {
        this.stepIndex += payload?.step ?? 0
        this.updateAnimate()
      }
    }

    if (notification === 'CX3_SET_DATE') {
      if (payload?.instanceId === this.config.instanceId || !payload?.instanceId) {
        this.tempMoment = new Date(payload?.date ?? null)
        this.stepIndex = 0
        this.updateAnimate()
      }
    }

    if (notification === 'CX3_RESET') {
      if (payload?.instanceId === this.config.instanceId || !payload?.instanceId) {
        this.tempMoment = null
        this.stepIndex = 0
        this.updateAnimate()
      }
    }

    if (notification === this.notifications.weatherNotification) {
      let convertedPayload = this.notifications.weatherPayload(payload)
      if (
        (this.config.useWeather 
          && ((this.config.weatherLocationName && convertedPayload.locationName.includes(this.config.weatherLocationName)) 
          || !this.config.weatherLocationName))
        && (Array.isArray(convertedPayload?.forecastArray) && convertedPayload?.forecastArray.length)
      ) {
        this.forecast = [...convertedPayload.forecastArray].map((o) => {
          let d = new Date(o.date)
          o.dateId = d.toLocaleDateString('en-CA')
          return o
        })
      } else {
        if (this.config.weatherLocationName && !convertedPayload.locationName.includes(this.config.weatherLocationName)) {
          Log.warn(`"weatherLocationName: '${this.config.weatherLocationName}'" doesn't match with location of weather module ('${convertedPayload.locationName}')`)
        }
      }
    }
  },

  getDom: function () {
    return new Promise((resolve, reject) => {
      let dom = document.createElement('div')
      dom.innerHTML = ""
      dom.classList.add('bodice', 'CX3_' + this.instanceId, 'CX3', 'mode_' + this.mode)
      if (this.config.fontSize) dom.style.setProperty('--fontsize', this.config.fontSize)
      dom.style.setProperty('--maxeventlines', this.config.maxEventLines)
      dom.style.setProperty('--eventheight', this.config.eventHeight)
      dom.style.setProperty('--displayEndTime', (this.config.displayEndTime) ? 'inherit' : 'none')
      dom.style.setProperty('--displayWeatherTemp', (this.config.displayWeatherTemp) ? 'inline-block' : 'none')
      dom = this.draw(dom, this.config)
      if (this.library?.loaded) {
        if (this.refreshTimer) {
          clearTimeout(this.refreshTimer)
          this.refreshTimer = null
        }
        this.refreshTimer = setTimeout(() => {
          clearTimeout(this.refreshTimer)
          this.refreshTimer = null
          this.tempMoment = null
          this.stepIndex = 0
          this.updateAnimate()
        }, this.config.refreshInterval)
      } else {
        Log.warn('[CX3] Module is not prepared yet, wait a while.')
      }
      resolve(dom)
    })
  },


  updated: function (dom) {
    if (!dom) return
    dom.querySelectorAll('.title')?.forEach((e) => {
      const parent = e.closest('.event')
      const {offsetWidth, scrollWidth} = e
      if (this.config.useMarquee && parent?.dataset?.noMarquee !== 'true' && offsetWidth < scrollWidth) {
        const m = document.createElement('span')
        m.innerHTML = e.innerHTML
        e.innerHTML = ''
        e.appendChild(m)
        e.classList.add('marquee')
        m.classList.add('marqueeText')
        const length = m.offsetWidth
        m.style.setProperty('--marqueeOffset', offsetWidth + 'px')
        m.style.setProperty('--marqueeScroll', scrollWidth + 'px')
        m.style.setProperty('--marqueeLength', length + 's')
      }
    })
  },

  draw: async function (dom, config) {
    if (!this.library?.loaded) return dom
    const {
      isToday, isThisMonth, isThisYear, getWeekNo, renderEventAgenda,
      prepareEvents, getBeginOfWeek, getEndOfWeek, displayLegend,
      // gapFromToday, renderEventAgenda, eventsByDate, makeWeatherDOM, getRelativeDate, 
    } = this.library

    const startDayOfWeek = getBeginOfWeek(new Date(), config).getDay()

    dom.innerHTML = ''

    const makeCellDom = (d, seq) => {
      let tm = new Date(d.valueOf())
      let cell = document.createElement('div')
      cell.classList.add('cell')
      if (isToday(tm)) cell.classList.add('today')
      if (isThisMonth(tm)) cell.classList.add('thisMonth')
      if (isThisYear(tm)) cell.classList.add('thisYear')
      cell.classList.add(
        'year_' + tm.getFullYear(),
        'month_' + (tm.getMonth() + 1),
        'date_' + tm.getDate(),
        'weekday_' + tm.getDay()
      )
      cell.dataset.date = new Date(tm.getFullYear(), tm.getMonth(), tm.getDate()).valueOf()
      this.config.weekends.forEach((w, i) => {
        if (tm.getDay() === w) cell.classList.add('weekend', 'weekend_' + (i + 1))
      })
      let h = document.createElement('div')
      h.classList.add('cellHeader')

      let cwDom = document.createElement('div')
      cwDom.innerHTML = getWeekNo(tm, config)
      cwDom.classList.add('cw')
      if (tm.getDay() === startDayOfWeek) {
        cwDom.classList.add('cwFirst')
      }

      h.appendChild(cwDom)

      let forecasted = this.forecast.find((e) => {
        return (tm.toLocaleDateString('en-CA') === e.dateId)
      })

      if (forecasted && forecasted?.weatherType) {
        let weatherDom = document.createElement('div')
        weatherDom.classList.add('cellWeather')
        let icon = document.createElement('span')
        icon.classList.add('wi', 'wi-' + forecasted.weatherType)
        weatherDom.appendChild(icon)
        let maxTemp = document.createElement('span')
        maxTemp.classList.add('maxTemp', 'temperature')
        maxTemp.innerHTML = Math.round(forecasted.maxTemperature)
        weatherDom.appendChild(maxTemp)
        let minTemp = document.createElement('span')
        minTemp.classList.add('minTemp', 'temperature')
        minTemp.innerHTML = Math.round(forecasted.minTemperature)
        weatherDom.appendChild(minTemp)
        h.appendChild(weatherDom)
      }
      let dateDom = document.createElement('div')
      dateDom.classList.add('cellDate')
      let dParts = new Intl.DateTimeFormat(this.locale, this.config.cellDateOptions).formatToParts(tm)
      let dateHTML = dParts.reduce((prev, cur, curIndex) => {
        prev = prev + `<span class="dateParts ${cur.type} seq_${curIndex}">${cur.value}</span>`
        return prev
      }, '')
      dateDom.innerHTML = dateHTML

      h.appendChild(dateDom)

      let b = document.createElement('div')
      b.classList.add('cellBody')

      let f = document.createElement('div')
      f.classList.add('cellFooter')

      cell.appendChild(h)
      cell.appendChild(b)
      cell.appendChild(f)
      return cell
    }

    const rangeCalendar = (mode, moment, config) => {
      let boc, eoc
      switch (mode) {
        case 'day': 
          boc = new Date(moment.getFullYear(), moment.getMonth(), moment.getDate() + this.dayIndex)
          eoc = new Date(boc.valueOf())
          eoc.setDate(boc.getDate() + 7 * this.weeksInView)
          eoc.setMilliseconds(-1)
          break
        case 'month':
          boc = getBeginOfWeek(new Date(moment.getFullYear(), moment.getMonth(), 1), config)
          eoc = getEndOfWeek(new Date(moment.getFullYear(), moment.getMonth() + 1, 0), config)
          break
        case 'week':
        default:
          boc = getBeginOfWeek(new Date(moment.getFullYear(), moment.getMonth(), moment.getDate() + (7 * this.weekIndex)), config)
          eoc = getEndOfWeek(new Date(boc.getFullYear(), boc.getMonth(), boc.getDate() + (7 * (this.weeksInView - 1))), config)
          break
      }
      return { boc, eoc }
    }

    let moment = this.getMoment()
    let { boc, eoc } = rangeCalendar(this.mode, moment, config)

    let events = prepareEvents({
      storedEvents: this.storedEvents,
      config: config,
      range: [boc, eoc]
    })

    let wm = new Date(boc.valueOf())

    let dayDom = document.createElement('div')
    dayDom.classList.add('headerContainer', 'weekGrid')
    for (i = 0; i < 7; i++) {
      let dm = new Date(wm.getFullYear(), wm.getMonth(), wm.getDate() + i)
      let day = (dm.getDay() + 7) % 7
      let dDom = document.createElement('div')
      dDom.classList.add('weekday', 'weekday_' + day)
      this.config.weekends.forEach((w, i) => {
        if (day === w) dDom.classList.add('weekend', 'weekend_' + (i + 1))
      })
      dDom.innerHTML = new Intl.DateTimeFormat(this.locale, this.config.headerWeekDayOptions).format(dm)
      dayDom.appendChild(dDom)
    }

    dom.appendChild(dayDom)

    do {
      let wDom = document.createElement('div')
      wDom.classList.add('week')
      wDom.dataset.weekNo = getWeekNo(wm, config)

      let ccDom = document.createElement('div')
      ccDom.classList.add('cellContainer', 'weekGrid')

      let ecDom = document.createElement('div')
      ecDom.classList.add('eventContainer', 'weekGrid', 'weekGridRow')

      let boundary = []

      let cm = new Date(wm.valueOf())
      for (i = 0; i < 7; i++) {
        if (i) cm = new Date(cm.getFullYear(), cm.getMonth(), cm.getDate() + 1)
        ccDom.appendChild(makeCellDom(cm, i))
        boundary.push(cm.getTime())
      }
      boundary.push(cm.setHours(23, 59, 59, 999))

      let sw = new Date(wm.valueOf())
      let ew = new Date(sw.getFullYear(), sw.getMonth(), sw.getDate() + 6, 23, 59, 59, 999)
      let eventsOfWeek = events.filter((ev) => {
        return !(ev.endDate <= sw.getTime() || ev.startDate >= ew.getTime())
      })
      for (let event of eventsOfWeek) {
        if (config.skipPassedEventToday) {
          if (event.today && event.isPassed && !event.isFullday && !event.isMultiday && !event.isCurrent) event.skip = true
        }
        if (event?.skip) continue

        let eDom = renderEventAgenda(
          event,
          {
            useSymbol: config.useSymbol,
            eventTimeOptions: config.eventTimeOptions,
            locale: this.locale,
            useIconify: config.useIconify,
          },
          moment
        )

        let startLine = 0
        if (event.startDate >= boundary.at(0)) {
          startLine = boundary.findIndex((b, idx, bounds) => {
            return (event.startDate >= b && event.startDate < bounds[idx + 1])
          })
        } else {
          eDom.classList.add('continueFromPreviousWeek')
        }

        let endLine = boundary.length - 1
        if (event.endDate <= boundary.at(-1) ) {
          endLine = boundary.findIndex((b, idx, bounds) => {
            return (event.endDate <= b && event.endDate > bounds[idx - 1])
          })
        } else {
          eDom.classList.add('continueToNextWeek')
        }

        eDom.style.gridColumnStart = startLine + 1
        eDom.style.gridColumnEnd = endLine + 1

        if (event?.noMarquee) {
          eDom.dataset.noMarquee = true
        }

        if (event?.skip) {
          eDom.dataset.skip = true
        }

        if (popoverSupported) {
          if (!eDom.id) eDom.id = eDom.dataset.calendarSeq + '_' + eDom.dataset.startDate + '_' + eDom.dataset.endDate + '_' + new Date().getTime()
          eDom.dataset.popoverble = true
          eDom.onclick = (ev) => {
            this.eventPopover(eDom)
          }
        }

        ecDom.appendChild(eDom)
      }

      let dateCells = ccDom.querySelectorAll('.cell')
      for (let i = 0; i < dateCells.length; i++) {
        let dateCell = dateCells[i]
        let dateStart = new Date(+dateCell.dataset.date)
        let dateEnd = new Date(dateStart.getFullYear(), dateStart.getMonth(), dateStart.getDate(), 23, 59, 59, 999)
        let thatDayEvents = eventsOfWeek.filter((ev) => {
          return !(ev.endDate <= dateStart.valueOf() || ev.startDate > dateEnd.valueOf())
        })
        dateCell.dataset.events = thatDayEvents.length
        dateCell.dataset.hasEvents = (thatDayEvents.length > 0) ? 'true' : 'false'
        if (typeof config.manipulateDateCell === 'function') {
          config.manipulateDateCell(dateCell, thatDayEvents)
        }

        if (config.showMore) {
          const skipped = thatDayEvents.filter(ev => ev.skip).length
          const noskip = thatDayEvents.length - skipped
          const noskipButOverflowed = (noskip > config.maxEventLines) ? noskip - config.maxEventLines : 0
          const hidden = skipped + noskipButOverflowed
          if (hidden) {
            dateCell.classList.add('hasMore')
            dateCell.style.setProperty('--more', hidden)
          }
        }

        if (popoverSupported) {
          if (!dateCell.id) dateCell.id = dateCell.dataset.date + '_' + new Date().getTime()
          dateCell.dataset.popoverble = true
          dateCell.onclick = (ev) => {
            this.dayPopover(dateCell, thatDayEvents, config)
          }
        }
      }

      wDom.appendChild(ccDom)
      wDom.appendChild(ecDom)

      dom.appendChild(wDom)
      wm = new Date(wm.getFullYear(), wm.getMonth(), wm.getDate() + 7)
    } while(wm.valueOf() <= eoc.valueOf())

    if (config.displayLegend) displayLegend(dom, events, config)
    return dom
  },

  getHeader: function () {
    if (this.mode === 'month') {
      let moment = this.getMoment()
      return new Intl.DateTimeFormat(this.locale, this.config.headerTitleOptions).format(new Date(moment.valueOf()))
    }
    return this.data.header
  },

  updateAnimate: function () {
    this.updateDom(
      (!animationSupported)
        ? this.config.animationSpeed
        : {
          options: {
            speed: this.config.animationSpeed,
            animate: {
              in: this.config.animateIn,
              out: this.config.animateOut
            }
          }
        }
    )
  }
})
