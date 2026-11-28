import{$ as e,D as t,Dt as n,E as r,F as i,G as a,H as o,J as s,Kt as c,N as l,O as u,P as d,Q as f,T as p,U as m,Ut as h,V as g,Wt as _,X as v,Z as y,at as b,bt as x,et as S,g as C,j as w,k as T,lt as E,st as ee,ut as D,vt as te,x as O}from"./useApi-CUWMwLLw-CdB9agTY.js";import{t as k}from"./collections-D6k0s6ZL.js";import{C as A,O as j,b as M,h as ne,k as N,s as P}from"./vue-router-CkfviPMk.js";import{a as re,c as ie,i as F,n as I,o as ae,r as oe,s as se,t as ce}from"./useListState-LXTGj1fE.js";import{t as le}from"./PageHeading-D8iQfrhX.js";import{$ as ue,A as de,E as L,G as fe,H as pe,J as me,K as he,M as ge,N as _e,S as R,Y as z,_ as B,a as ve,b as ye,c as be,d as xe,dt as V,et as Se,ft as Ce,ht as H,l as we,n as Te,nt as Ee,o as De,ot as Oe,p as ke,pt as U,r as Ae,rt as W,s as je,st as G,tt as Me,x as Ne,z as Pe}from"./admin-CJk9UxOc.js";import{a as K,c as Fe,d as Ie,i as q,l as Le,n as Re,o as ze,r as Be,s as Ve,t as He,u as Ue}from"./useNotify-DcPhce6q.js";import{n as We,t as Ge}from"./ImageUrlField-Ch-NP3zN.js";import{t as Ke}from"./useBusy-0KCoNZun.js";import{t as qe}from"./useEmbeddedList-DqNdZng_.js";var Je=e=>`/collections/${encodeURIComponent(e)}/products`,J=(e,t)=>`${Je(e)}/${encodeURIComponent(t)}`,Y={get:(e,t)=>P.get(J(e,t)),create:(e,t)=>P.post(Je(e),{product:t}),update:(e,t,n)=>P.put(J(e,t),{product:n}),remove:(e,t)=>P.delete(J(e,t))},Ye={upload:(e,t,n)=>P.post(`${J(e,t)}/images/upload`,{image:{url:n}}),makeCover:(e,t,n)=>P.patch(`${J(e,t)}/images/${n}/make_cover`),remove:(e,t,n)=>P.delete(`${J(e,t)}/images/${n}`)},Xe=B.extend({name:`chip`,style:`
    .p-chip {
        display: inline-flex;
        align-items: center;
        background: dt('chip.background');
        color: dt('chip.color');
        border-radius: dt('chip.border.radius');
        padding-block: dt('chip.padding.y');
        padding-inline: dt('chip.padding.x');
        gap: dt('chip.gap');
    }

    .p-chip-icon {
        color: dt('chip.icon.color');
        font-size: dt('chip.icon.size');
        width: dt('chip.icon.size');
        height: dt('chip.icon.size');
    }

    .p-chip-image {
        border-radius: 50%;
        width: dt('chip.image.width');
        height: dt('chip.image.height');
        margin-inline-start: calc(-1 * dt('chip.padding.y'));
    }

    .p-chip:has(.p-chip-remove-icon) {
        padding-inline-end: dt('chip.padding.y');
    }

    .p-chip:has(.p-chip-image) {
        padding-block-start: calc(dt('chip.padding.y') / 2);
        padding-block-end: calc(dt('chip.padding.y') / 2);
    }

    .p-chip-remove-icon {
        cursor: pointer;
        font-size: dt('chip.remove.icon.size');
        width: dt('chip.remove.icon.size');
        height: dt('chip.remove.icon.size');
        color: dt('chip.remove.icon.color');
        border-radius: 50%;
        transition:
            outline-color dt('chip.transition.duration'),
            box-shadow dt('chip.transition.duration');
        outline-color: transparent;
    }

    .p-chip-remove-icon:focus-visible {
        box-shadow: dt('chip.remove.icon.focus.ring.shadow');
        outline: dt('chip.remove.icon.focus.ring.width') dt('chip.remove.icon.focus.ring.style') dt('chip.remove.icon.focus.ring.color');
        outline-offset: dt('chip.remove.icon.focus.ring.offset');
    }
`,classes:{root:`p-chip p-component`,image:`p-chip-image`,icon:`p-chip-icon`,label:`p-chip-label`,removeIcon:`p-chip-remove-icon`}}),Ze={name:`Chip`,extends:{name:`BaseChip`,extends:ke,props:{label:{type:[String,Number],default:null},icon:{type:String,default:null},image:{type:String,default:null},removable:{type:Boolean,default:!1},removeIcon:{type:String,default:void 0}},style:Xe,provide:function(){return{$pcChip:this,$parentInstance:this}}},inheritAttrs:!1,emits:[`remove`],data:function(){return{visible:!0}},methods:{onKeydown:function(e){(e.key===`Enter`||e.key===`Backspace`)&&this.close(e)},close:function(e){this.visible=!1,this.$emit(`remove`,e)}},computed:{dataP:function(){return W({removable:this.removable})}},components:{TimesCircleIcon:Te}},Qe=[`aria-label`,`data-p`],$e=[`src`];function et(e,n,r,i,a,l){return a.visible?(s(),T(`div`,o({key:0,class:e.cx(`root`),"aria-label":e.label},e.ptmi(`root`),{"data-p":l.dataP}),[y(e.$slots,`default`,{},function(){return[e.image?(s(),T(`img`,o({key:0,src:e.image},e.ptm(`image`),{class:e.cx(`image`)}),null,16,$e)):e.$slots.icon?(s(),t(S(e.$slots.icon),o({key:1,class:e.cx(`icon`)},e.ptm(`icon`)),null,16,[`class`])):e.icon?(s(),T(`span`,o({key:2,class:[e.cx(`icon`),e.icon]},e.ptm(`icon`)),null,16)):u(``,!0),e.label===null?u(``,!0):(s(),T(`div`,o({key:3,class:e.cx(`label`)},e.ptm(`label`)),c(e.label),17))]}),e.removable?y(e.$slots,`removeicon`,{key:0,removeCallback:l.close,keydownCallback:l.onKeydown},function(){return[(s(),t(S(e.removeIcon?`span`:`TimesCircleIcon`),o({class:[e.cx(`removeIcon`),e.removeIcon],onClick:l.close,onKeydown:l.onKeydown},e.ptm(`removeIcon`)),null,16,[`class`,`onClick`,`onKeydown`]))]}):u(``,!0)],16,Qe)):u(``,!0)}Ze.render=et;var tt=B.extend({name:`multiselect`,style:`
    .p-multiselect {
        display: inline-flex;
        cursor: pointer;
        position: relative;
        user-select: none;
        background: dt('multiselect.background');
        border: 1px solid dt('multiselect.border.color');
        transition:
            background dt('multiselect.transition.duration'),
            color dt('multiselect.transition.duration'),
            border-color dt('multiselect.transition.duration'),
            outline-color dt('multiselect.transition.duration'),
            box-shadow dt('multiselect.transition.duration');
        border-radius: dt('multiselect.border.radius');
        outline-color: transparent;
        box-shadow: dt('multiselect.shadow');
    }

    .p-multiselect:not(.p-disabled):hover {
        border-color: dt('multiselect.hover.border.color');
    }

    .p-multiselect:not(.p-disabled).p-focus {
        border-color: dt('multiselect.focus.border.color');
        box-shadow: dt('multiselect.focus.ring.shadow');
        outline: dt('multiselect.focus.ring.width') dt('multiselect.focus.ring.style') dt('multiselect.focus.ring.color');
        outline-offset: dt('multiselect.focus.ring.offset');
    }

    .p-multiselect.p-variant-filled {
        background: dt('multiselect.filled.background');
    }

    .p-multiselect.p-variant-filled:not(.p-disabled):hover {
        background: dt('multiselect.filled.hover.background');
    }

    .p-multiselect.p-variant-filled.p-focus {
        background: dt('multiselect.filled.focus.background');
    }

    .p-multiselect.p-invalid {
        border-color: dt('multiselect.invalid.border.color');
    }

    .p-multiselect.p-disabled {
        opacity: 1;
        background: dt('multiselect.disabled.background');
    }

    .p-multiselect-dropdown {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        background: transparent;
        color: dt('multiselect.dropdown.color');
        width: dt('multiselect.dropdown.width');
        border-start-end-radius: dt('multiselect.border.radius');
        border-end-end-radius: dt('multiselect.border.radius');
    }

    .p-multiselect-clear-icon {
        align-self: center;
        color: dt('multiselect.clear.icon.color');
        inset-inline-end: dt('multiselect.dropdown.width');
    }

    .p-multiselect-label-container {
        overflow: hidden;
        flex: 1 1 auto;
        cursor: pointer;
    }

    .p-multiselect-label {
        white-space: nowrap;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: dt('multiselect.padding.y') dt('multiselect.padding.x');
        color: dt('multiselect.color');
    }

    .p-multiselect-display-chip .p-multiselect-label {
        display: flex;
        align-items: center;
        gap: calc(dt('multiselect.padding.y') / 2);
    }

    .p-multiselect-label.p-placeholder {
        color: dt('multiselect.placeholder.color');
    }

    .p-multiselect.p-invalid .p-multiselect-label.p-placeholder {
        color: dt('multiselect.invalid.placeholder.color');
    }

    .p-multiselect.p-disabled .p-multiselect-label {
        color: dt('multiselect.disabled.color');
    }

    .p-multiselect-label-empty {
        overflow: hidden;
        visibility: hidden;
    }

    .p-multiselect-overlay {
        position: absolute;
        top: 0;
        left: 0;
        background: dt('multiselect.overlay.background');
        color: dt('multiselect.overlay.color');
        border: 1px solid dt('multiselect.overlay.border.color');
        border-radius: dt('multiselect.overlay.border.radius');
        box-shadow: dt('multiselect.overlay.shadow');
        min-width: 100%;
    }

    .p-multiselect-header {
        display: flex;
        align-items: center;
        padding: dt('multiselect.list.header.padding');
    }

    .p-multiselect-header .p-checkbox {
        margin-inline-end: dt('multiselect.option.gap');
    }

    .p-multiselect-filter-container {
        flex: 1 1 auto;
    }

    .p-multiselect-filter {
        width: 100%;
    }

    .p-multiselect-list-container {
        overflow: auto;
    }

    .p-multiselect-list {
        margin: 0;
        padding: 0;
        list-style-type: none;
        padding: dt('multiselect.list.padding');
        display: flex;
        flex-direction: column;
        gap: dt('multiselect.list.gap');
    }

    .p-multiselect-option {
        cursor: pointer;
        font-weight: normal;
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        gap: dt('multiselect.option.gap');
        padding: dt('multiselect.option.padding');
        border: 0 none;
        color: dt('multiselect.option.color');
        background: transparent;
        transition:
            background dt('multiselect.transition.duration'),
            color dt('multiselect.transition.duration'),
            border-color dt('multiselect.transition.duration'),
            box-shadow dt('multiselect.transition.duration'),
            outline-color dt('multiselect.transition.duration');
        border-radius: dt('multiselect.option.border.radius');
    }

    .p-multiselect-option:not(.p-multiselect-option-selected):not(.p-disabled).p-focus {
        background: dt('multiselect.option.focus.background');
        color: dt('multiselect.option.focus.color');
    }

    .p-multiselect-option:not(.p-multiselect-option-selected):not(.p-disabled):hover {
        background: dt('multiselect.option.focus.background');
        color: dt('multiselect.option.focus.color');
    }

    .p-multiselect-option.p-multiselect-option-selected {
        background: dt('multiselect.option.selected.background');
        color: dt('multiselect.option.selected.color');
    }

    .p-multiselect-option.p-multiselect-option-selected.p-focus {
        background: dt('multiselect.option.selected.focus.background');
        color: dt('multiselect.option.selected.focus.color');
    }

    .p-multiselect-option-group {
        cursor: auto;
        margin: 0;
        padding: dt('multiselect.option.group.padding');
        background: dt('multiselect.option.group.background');
        color: dt('multiselect.option.group.color');
        font-weight: dt('multiselect.option.group.font.weight');
    }

    .p-multiselect-empty-message {
        padding: dt('multiselect.empty.message.padding');
    }

    .p-multiselect-label .p-chip {
        padding-block-start: calc(dt('multiselect.padding.y') / 2);
        padding-block-end: calc(dt('multiselect.padding.y') / 2);
        border-radius: dt('multiselect.chip.border.radius');
    }

    .p-multiselect-label:has(.p-chip) {
        padding: calc(dt('multiselect.padding.y') / 2) calc(dt('multiselect.padding.x') / 2);
    }

    .p-multiselect-fluid {
        display: flex;
        width: 100%;
    }

    .p-multiselect-sm .p-multiselect-label {
        font-size: dt('multiselect.sm.font.size');
        padding-block: dt('multiselect.sm.padding.y');
        padding-inline: dt('multiselect.sm.padding.x');
    }

    .p-multiselect-sm .p-multiselect-dropdown .p-icon {
        font-size: dt('multiselect.sm.font.size');
        width: dt('multiselect.sm.font.size');
        height: dt('multiselect.sm.font.size');
    }

    .p-multiselect-lg .p-multiselect-label {
        font-size: dt('multiselect.lg.font.size');
        padding-block: dt('multiselect.lg.padding.y');
        padding-inline: dt('multiselect.lg.padding.x');
    }

    .p-multiselect-lg .p-multiselect-dropdown .p-icon {
        font-size: dt('multiselect.lg.font.size');
        width: dt('multiselect.lg.font.size');
        height: dt('multiselect.lg.font.size');
    }

    .p-floatlabel-in .p-multiselect-filter {
        padding-block-start: dt('multiselect.padding.y');
        padding-block-end: dt('multiselect.padding.y');
    }
`,classes:{root:function(e){var t=e.instance,n=e.props;return[`p-multiselect p-component p-inputwrapper`,{"p-multiselect-display-chip":n.display===`chip`,"p-disabled":n.disabled,"p-invalid":t.$invalid,"p-variant-filled":t.$variant===`filled`,"p-focus":t.focused,"p-inputwrapper-filled":t.$filled,"p-inputwrapper-focus":t.focused||t.overlayVisible,"p-multiselect-open":t.overlayVisible,"p-multiselect-fluid":t.$fluid,"p-multiselect-sm p-inputfield-sm":n.size===`small`,"p-multiselect-lg p-inputfield-lg":n.size===`large`}]},labelContainer:`p-multiselect-label-container`,label:function(e){var t=e.instance,n=e.props;return[`p-multiselect-label`,{"p-placeholder":t.label===n.placeholder,"p-multiselect-label-empty":!n.placeholder&&!t.$filled}]},clearIcon:`p-multiselect-clear-icon`,chipItem:`p-multiselect-chip-item`,pcChip:`p-multiselect-chip`,chipIcon:`p-multiselect-chip-icon`,dropdown:`p-multiselect-dropdown`,loadingIcon:`p-multiselect-loading-icon`,dropdownIcon:`p-multiselect-dropdown-icon`,overlay:`p-multiselect-overlay p-component`,header:`p-multiselect-header`,pcFilterContainer:`p-multiselect-filter-container`,pcFilter:`p-multiselect-filter`,listContainer:`p-multiselect-list-container`,list:`p-multiselect-list`,optionGroup:`p-multiselect-option-group`,option:function(e){var t=e.instance,n=e.option,r=e.index,i=e.getItemOptions,a=e.props;return[`p-multiselect-option`,{"p-multiselect-option-selected":t.isSelected(n)&&a.highlightOnSelect,"p-focus":t.focusedOptionIndex===t.getOptionIndex(r,i),"p-disabled":t.isOptionDisabled(n)}]},emptyMessage:`p-multiselect-empty-message`},inlineStyles:{root:function(e){return{position:e.props.appendTo===`self`?`relative`:void 0}}}}),nt={name:`BaseMultiSelect`,extends:ze,props:{options:Array,optionLabel:null,optionValue:null,optionDisabled:null,optionGroupLabel:null,optionGroupChildren:null,scrollHeight:{type:String,default:`14rem`},placeholder:String,inputId:{type:String,default:null},panelClass:{type:String,default:null},panelStyle:{type:null,default:null},overlayClass:{type:String,default:null},overlayStyle:{type:null,default:null},dataKey:null,showClear:{type:Boolean,default:!1},clearIcon:{type:String,default:void 0},resetFilterOnClear:{type:Boolean,default:!1},filter:Boolean,filterPlaceholder:String,filterLocale:String,filterMatchMode:{type:String,default:`contains`},filterFields:{type:Array,default:null},appendTo:{type:[String,Object],default:`body`},display:{type:String,default:`comma`},selectedItemsLabel:{type:String,default:null},maxSelectedLabels:{type:Number,default:null},selectionLimit:{type:Number,default:null},showToggleAll:{type:Boolean,default:!0},loading:{type:Boolean,default:!1},checkboxIcon:{type:String,default:void 0},dropdownIcon:{type:String,default:void 0},filterIcon:{type:String,default:void 0},loadingIcon:{type:String,default:void 0},removeTokenIcon:{type:String,default:void 0},chipIcon:{type:String,default:void 0},selectAll:{type:Boolean,default:null},resetFilterOnHide:{type:Boolean,default:!1},virtualScrollerOptions:{type:Object,default:null},autoOptionFocus:{type:Boolean,default:!1},autoFilterFocus:{type:Boolean,default:!1},focusOnHover:{type:Boolean,default:!0},highlightOnSelect:{type:Boolean,default:!1},filterMessage:{type:String,default:null},selectionMessage:{type:String,default:null},emptySelectionMessage:{type:String,default:null},emptyFilterMessage:{type:String,default:null},emptyMessage:{type:String,default:null},tabindex:{type:Number,default:0},ariaLabel:{type:String,default:null},ariaLabelledby:{type:String,default:null}},style:tt,provide:function(){return{$pcMultiSelect:this,$parentInstance:this}}};function X(e){"@babel/helpers - typeof";return X=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},X(e)}function rt(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function it(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?rt(Object(n),!0).forEach(function(t){Z(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):rt(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function Z(e,t,n){return(t=at(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function at(e){var t=ot(e,`string`);return X(t)==`symbol`?t:t+``}function ot(e,t){if(X(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t);if(X(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function st(e){return dt(e)||ut(e)||lt(e)||ct()}function ct(){throw TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function lt(e,t){if(e){if(typeof e==`string`)return ft(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?ft(e,t):void 0}}function ut(e){if(typeof Symbol<`u`&&e[Symbol.iterator]!=null||e[`@@iterator`]!=null)return Array.from(e)}function dt(e){if(Array.isArray(e))return ft(e)}function ft(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}var pt={name:`MultiSelect`,extends:nt,inheritAttrs:!1,emits:[`change`,`focus`,`blur`,`before-show`,`before-hide`,`show`,`hide`,`filter`,`selectall-change`],inject:{$pcFluid:{default:null}},outsideClickListener:null,scrollHandler:null,resizeListener:null,overlay:null,list:null,virtualScroller:null,startRangeIndex:-1,searchTimeout:null,searchValue:``,selectOnFocus:!1,data:function(){return{clicked:!1,focused:!1,focusedOptionIndex:-1,filterValue:null,overlayVisible:!1}},watch:{options:function(){this.autoUpdateModel()}},mounted:function(){this.autoUpdateModel()},beforeUnmount:function(){this.unbindOutsideClickListener(),this.unbindResizeListener(),this.scrollHandler&&=(this.scrollHandler.destroy(),null),this.overlay&&=(R.clear(this.overlay),null)},methods:{getOptionIndex:function(e,t){return this.virtualScrollerDisabled?e:t&&t(e).index},getOptionLabel:function(e){return this.optionLabel?U(e,this.optionLabel):e},getOptionValue:function(e){return this.optionValue?U(e,this.optionValue):e},getOptionRenderKey:function(e,t){return this.dataKey?U(e,this.dataKey):this.getOptionLabel(e)+`_${t}`},getHeaderCheckboxPTOptions:function(e){return this.ptm(e,{context:{selected:this.allSelected}})},getCheckboxPTOptions:function(e,t,n,r){return this.ptm(r,{context:{selected:this.isSelected(e),focused:this.focusedOptionIndex===this.getOptionIndex(n,t),disabled:this.isOptionDisabled(e)}})},isOptionDisabled:function(e){return this.maxSelectionLimitReached&&!this.isSelected(e)?!0:this.optionDisabled?U(e,this.optionDisabled):!1},isOptionGroup:function(e){return!!(this.optionGroupLabel&&e.optionGroup&&e.group)},getOptionGroupLabel:function(e){return U(e,this.optionGroupLabel)},getOptionGroupChildren:function(e){return U(e,this.optionGroupChildren)},getAriaPosInset:function(e){var t=this;return(this.optionGroupLabel?e-this.visibleOptions.slice(0,e).filter(function(e){return t.isOptionGroup(e)}).length:e)+1},show:function(e){this.$emit(`before-show`),this.overlayVisible=!0,this.focusedOptionIndex=this.focusedOptionIndex===-1?this.autoOptionFocus?this.findFirstFocusedOptionIndex():this.findSelectedOptionIndex():this.focusedOptionIndex,e&&z(this.$refs.focusInput)},hide:function(e){var t=this,n=function(){t.$emit(`before-hide`),t.overlayVisible=!1,t.clicked=!1,t.focusedOptionIndex=-1,t.searchValue=``,t.resetFilterOnHide&&(t.filterValue=null),e&&z(t.$refs.focusInput)};setTimeout(function(){n()},0)},onFocus:function(e){this.disabled||(this.focused=!0,this.overlayVisible&&(this.focusedOptionIndex=this.focusedOptionIndex===-1?this.autoOptionFocus?this.findFirstFocusedOptionIndex():this.findSelectedOptionIndex():this.focusedOptionIndex,!this.autoFilterFocus&&this.scrollInView(this.focusedOptionIndex)),this.$emit(`focus`,e))},onBlur:function(e){var t,n;this.clicked=!1,this.focused=!1,this.focusedOptionIndex=-1,this.searchValue=``,this.$emit(`blur`,e),(t=(n=this.formField).onBlur)==null||t.call(n)},onKeyDown:function(e){var t=this;if(this.disabled)e.preventDefault();else{var n=e.metaKey||e.ctrlKey;switch(e.code){case`ArrowDown`:this.onArrowDownKey(e);break;case`ArrowUp`:this.onArrowUpKey(e);break;case`Home`:this.onHomeKey(e);break;case`End`:this.onEndKey(e);break;case`PageDown`:this.onPageDownKey(e);break;case`PageUp`:this.onPageUpKey(e);break;case`Enter`:case`NumpadEnter`:case`Space`:this.onEnterKey(e);break;case`Escape`:this.onEscapeKey(e);break;case`Tab`:this.onTabKey(e);break;case`ShiftLeft`:case`ShiftRight`:this.onShiftKey(e);break;default:if(e.code===`KeyA`&&n){var r=this.visibleOptions.filter(function(e){return t.isValidOption(e)}).map(function(e){return t.getOptionValue(e)});this.updateModel(e,r),e.preventDefault();break}!n&&Oe(e.key)&&(!this.overlayVisible&&this.show(),this.searchOptions(e),e.preventDefault())}this.clicked=!1}},onContainerClick:function(e){this.disabled||this.loading||e.target.tagName===`INPUT`||e.target.getAttribute(`data-pc-section`)===`clearicon`||e.target.closest(`[data-pc-section="clearicon"]`)||(this.overlay&&this.overlay.contains(e.target)||(this.overlayVisible?this.hide(!0):this.show(!0)),this.clicked=!0)},onClearClick:function(e){this.updateModel(e,[]),this.resetFilterOnClear&&(this.filterValue=null)},onFirstHiddenFocus:function(e){var t=e.relatedTarget===this.$refs.focusInput?Me(this.overlay,`:not([data-p-hidden-focusable="true"])`):this.$refs.focusInput;z(t)},onLastHiddenFocus:function(e){var t=e.relatedTarget===this.$refs.focusInput?_e(this.overlay,`:not([data-p-hidden-focusable="true"])`):this.$refs.focusInput;z(t)},onOptionSelect:function(e,t){var n=this,r=arguments.length>2&&arguments[2]!==void 0?arguments[2]:-1,i=arguments.length>3&&arguments[3]!==void 0&&arguments[3];if(!(this.disabled||this.isOptionDisabled(t))){var a=this.isSelected(t),o=null;o=a?this.d_value.filter(function(e){return!V(e,n.getOptionValue(t),n.equalityKey)}):[].concat(st(this.d_value||[]),[this.getOptionValue(t)]),this.updateModel(e,o),r!==-1&&(this.focusedOptionIndex=r),i&&z(this.$refs.focusInput)}},onOptionMouseMove:function(e,t){this.focusOnHover&&this.changeFocusedOptionIndex(e,t)},onOptionSelectRange:function(e){var t=this,n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:-1,r=arguments.length>2&&arguments[2]!==void 0?arguments[2]:-1;if(n===-1&&(n=this.findNearestSelectedOptionIndex(r,!0)),r===-1&&(r=this.findNearestSelectedOptionIndex(n)),n!==-1&&r!==-1){var i=Math.min(n,r),a=Math.max(n,r),o=this.visibleOptions.slice(i,a+1).filter(function(e){return t.isValidOption(e)}).map(function(e){return t.getOptionValue(e)});this.updateModel(e,o)}},onFilterChange:function(e){var t=e.target.value;this.filterValue=t,this.focusedOptionIndex=-1,this.$emit(`filter`,{originalEvent:e,value:t}),!this.virtualScrollerDisabled&&this.virtualScroller.scrollToIndex(0)},onFilterKeyDown:function(e){switch(e.code){case`ArrowDown`:this.onArrowDownKey(e);break;case`ArrowUp`:this.onArrowUpKey(e,!0);break;case`ArrowLeft`:case`ArrowRight`:this.onArrowLeftKey(e,!0);break;case`Home`:this.onHomeKey(e,!0);break;case`End`:this.onEndKey(e,!0);break;case`Enter`:case`NumpadEnter`:this.onEnterKey(e);break;case`Escape`:this.onEscapeKey(e);break;case`Tab`:this.onTabKey(e,!0)}},onFilterBlur:function(){this.focusedOptionIndex=-1},onFilterUpdated:function(){this.overlayVisible&&this.alignOverlay()},onOverlayClick:function(e){q.emit(`overlay-click`,{originalEvent:e,target:this.$el})},onOverlayKeyDown:function(e){e.code===`Escape`&&this.onEscapeKey(e)},onArrowDownKey:function(e){if(!this.overlayVisible)this.show();else{var t=this.focusedOptionIndex===-1?this.clicked?this.findFirstOptionIndex():this.findFirstFocusedOptionIndex():this.findNextOptionIndex(this.focusedOptionIndex);e.shiftKey&&this.onOptionSelectRange(e,this.startRangeIndex,t),this.changeFocusedOptionIndex(e,t)}e.preventDefault()},onArrowUpKey:function(e){var t=arguments.length>1&&arguments[1]!==void 0&&arguments[1];if(e.altKey&&!t)this.focusedOptionIndex!==-1&&this.onOptionSelect(e,this.visibleOptions[this.focusedOptionIndex]),this.overlayVisible&&this.hide(),e.preventDefault();else{var n=this.focusedOptionIndex===-1?this.clicked?this.findLastOptionIndex():this.findLastFocusedOptionIndex():this.findPrevOptionIndex(this.focusedOptionIndex);e.shiftKey&&this.onOptionSelectRange(e,n,this.startRangeIndex),this.changeFocusedOptionIndex(e,n),!this.overlayVisible&&this.show(),e.preventDefault()}},onArrowLeftKey:function(e){arguments.length>1&&arguments[1]!==void 0&&arguments[1]&&(this.focusedOptionIndex=-1)},onHomeKey:function(e){if(arguments.length>1&&arguments[1]!==void 0&&arguments[1]){var t=e.currentTarget;e.shiftKey?t.setSelectionRange(0,e.target.selectionStart):(t.setSelectionRange(0,0),this.focusedOptionIndex=-1)}else{var n=e.metaKey||e.ctrlKey,r=this.findFirstOptionIndex();e.shiftKey&&n&&this.onOptionSelectRange(e,r,this.startRangeIndex),this.changeFocusedOptionIndex(e,r),!this.overlayVisible&&this.show()}e.preventDefault()},onEndKey:function(e){if(arguments.length>1&&arguments[1]!==void 0&&arguments[1]){var t=e.currentTarget;if(e.shiftKey)t.setSelectionRange(e.target.selectionStart,t.value.length);else{var n=t.value.length;t.setSelectionRange(n,n),this.focusedOptionIndex=-1}}else{var r=e.metaKey||e.ctrlKey,i=this.findLastOptionIndex();e.shiftKey&&r&&this.onOptionSelectRange(e,this.startRangeIndex,i),this.changeFocusedOptionIndex(e,i),!this.overlayVisible&&this.show()}e.preventDefault()},onPageUpKey:function(e){this.scrollInView(0),e.preventDefault()},onPageDownKey:function(e){this.scrollInView(this.visibleOptions.length-1),e.preventDefault()},onEnterKey:function(e){this.overlayVisible?this.focusedOptionIndex!==-1&&(e.shiftKey?this.onOptionSelectRange(e,this.focusedOptionIndex):this.onOptionSelect(e,this.visibleOptions[this.focusedOptionIndex])):(this.focusedOptionIndex=-1,this.onArrowDownKey(e)),e.preventDefault()},onEscapeKey:function(e){this.overlayVisible&&(this.hide(!0),e.stopPropagation()),e.preventDefault()},onTabKey:function(e){arguments.length>1&&arguments[1]!==void 0&&arguments[1]||(this.overlayVisible&&this.hasFocusableElements()?(z(e.shiftKey?this.$refs.lastHiddenFocusableElementOnOverlay:this.$refs.firstHiddenFocusableElementOnOverlay),e.preventDefault()):(this.focusedOptionIndex!==-1&&this.onOptionSelect(e,this.visibleOptions[this.focusedOptionIndex]),this.overlayVisible&&this.hide(this.filter)))},onShiftKey:function(){this.startRangeIndex=this.focusedOptionIndex},onOverlayEnter:function(e){R.set(`overlay`,e,this.$primevue.config.zIndex.overlay),Pe(e,{position:`absolute`,top:`0`}),this.alignOverlay(),this.scrollInView(),this.autoFilterFocus&&z(this.$refs.filterInput.$el),this.autoUpdateModel(),this.$attrSelector&&e.setAttribute(this.$attrSelector,``)},onOverlayAfterEnter:function(){this.bindOutsideClickListener(),this.bindScrollListener(),this.bindResizeListener(),this.$emit(`show`)},onOverlayLeave:function(e){e.style.pointerEvents=`none`,this.unbindOutsideClickListener(),this.unbindScrollListener(),this.unbindResizeListener(),this.$emit(`hide`),this.overlay=null},onOverlayAfterLeave:function(e){R.clear(e)},alignOverlay:function(){this.appendTo===`self`?de(this.overlay,this.$el):(this.overlay.style.minWidth=Se(this.$el)+`px`,L(this.overlay,this.$el))},bindOutsideClickListener:function(){var e=this;this.outsideClickListener||(this.outsideClickListener=function(t){e.overlayVisible&&e.isOutsideClicked(t)&&e.hide()},document.addEventListener(`click`,this.outsideClickListener,!0))},unbindOutsideClickListener:function(){this.outsideClickListener&&=(document.removeEventListener(`click`,this.outsideClickListener,!0),null)},bindScrollListener:function(){var e=this;this.scrollHandler||=new Ie(this.$refs.container,function(){e.overlayVisible&&e.hide()}),this.scrollHandler.bindScrollListener()},unbindScrollListener:function(){this.scrollHandler&&this.scrollHandler.unbindScrollListener()},bindResizeListener:function(){var e=this;this.resizeListener||(this.resizeListener=function(){e.overlayVisible&&!fe()&&e.hide()},window.addEventListener(`resize`,this.resizeListener))},unbindResizeListener:function(){this.resizeListener&&=(window.removeEventListener(`resize`,this.resizeListener),null)},isOutsideClicked:function(e){return!(this.$el.isSameNode(e.target)||this.$el.contains(e.target)||this.overlay&&this.overlay.contains(e.target))},getLabelByValue:function(e){var t=this,n=(this.optionGroupLabel?this.flatOptions(this.options):this.options||[]).find(function(n){return!t.isOptionGroup(n)&&V(t.getOptionValue(n),e,t.equalityKey)});return this.getOptionLabel(n)},getSelectedItemsLabel:function(){var e=/{(.*?)}/,t=this.selectedItemsLabel||this.$primevue.config.locale.selectionMessage;return e.test(t)?t.replace(t.match(e)[0],this.d_value.length+``):t},onToggleAll:function(e){var t=this;if(this.selectAll!==null)this.$emit(`selectall-change`,{originalEvent:e,checked:!this.allSelected});else{var n=this.allSelected?[]:this.visibleOptions.filter(function(e){return t.isValidOption(e)}).map(function(e){return t.getOptionValue(e)});this.updateModel(e,n)}},removeOption:function(e,t){var n=this;e.stopPropagation();var r=this.d_value.filter(function(e){return!V(e,t,n.equalityKey)});this.updateModel(e,r)},clearFilter:function(){this.filterValue=null},hasFocusableElements:function(){return me(this.overlay,`:not([data-p-hidden-focusable="true"])`).length>0},isOptionMatched:function(e){return this.isValidOption(e)&&typeof this.getOptionLabel(e)==`string`&&this.getOptionLabel(e)?.toLocaleLowerCase(this.filterLocale).startsWith(this.searchValue.toLocaleLowerCase(this.filterLocale))},isValidOption:function(e){return H(e)&&!(this.isOptionDisabled(e)||this.isOptionGroup(e))},isValidSelectedOption:function(e){return this.isValidOption(e)&&this.isSelected(e)},isEquals:function(e,t){return V(e,t,this.equalityKey)},isSelected:function(e){var t=this,n=this.getOptionValue(e);return(this.d_value||[]).some(function(e){return t.isEquals(e,n)})},findFirstOptionIndex:function(){var e=this;return this.visibleOptions.findIndex(function(t){return e.isValidOption(t)})},findLastOptionIndex:function(){var e=this;return G(this.visibleOptions,function(t){return e.isValidOption(t)})},findNextOptionIndex:function(e){var t=this,n=e<this.visibleOptions.length-1?this.visibleOptions.slice(e+1).findIndex(function(e){return t.isValidOption(e)}):-1;return n>-1?n+e+1:e},findPrevOptionIndex:function(e){var t=this,n=e>0?G(this.visibleOptions.slice(0,e),function(e){return t.isValidOption(e)}):-1;return n>-1?n:e},findSelectedOptionIndex:function(){var e=this;if(this.$filled){for(var t=function(){var t=e.d_value[r],n=e.visibleOptions.findIndex(function(n){return e.isValidSelectedOption(n)&&e.isEquals(t,e.getOptionValue(n))});if(n>-1)return{v:n}},n,r=this.d_value.length-1;r>=0;r--)if(n=t(),n)return n.v}return-1},findFirstSelectedOptionIndex:function(){var e=this;return this.$filled?this.visibleOptions.findIndex(function(t){return e.isValidSelectedOption(t)}):-1},findLastSelectedOptionIndex:function(){var e=this;return this.$filled?G(this.visibleOptions,function(t){return e.isValidSelectedOption(t)}):-1},findNextSelectedOptionIndex:function(e){var t=this,n=this.$filled&&e<this.visibleOptions.length-1?this.visibleOptions.slice(e+1).findIndex(function(e){return t.isValidSelectedOption(e)}):-1;return n>-1?n+e+1:-1},findPrevSelectedOptionIndex:function(e){var t=this,n=this.$filled&&e>0?G(this.visibleOptions.slice(0,e),function(e){return t.isValidSelectedOption(e)}):-1;return n>-1?n:-1},findNearestSelectedOptionIndex:function(e){var t=arguments.length>1&&arguments[1]!==void 0&&arguments[1],n=-1;return this.$filled&&(t?(n=this.findPrevSelectedOptionIndex(e),n=n===-1?this.findNextSelectedOptionIndex(e):n):(n=this.findNextSelectedOptionIndex(e),n=n===-1?this.findPrevSelectedOptionIndex(e):n)),n>-1?n:e},findFirstFocusedOptionIndex:function(){var e=this.findFirstSelectedOptionIndex();return e<0?this.findFirstOptionIndex():e},findLastFocusedOptionIndex:function(){var e=this.findSelectedOptionIndex();return e<0?this.findLastOptionIndex():e},searchOptions:function(e){var t=this;this.searchValue=(this.searchValue||``)+e.key;var n=-1;H(this.searchValue)&&(this.focusedOptionIndex===-1?n=this.visibleOptions.findIndex(function(e){return t.isOptionMatched(e)}):(n=this.visibleOptions.slice(this.focusedOptionIndex).findIndex(function(e){return t.isOptionMatched(e)}),n=n===-1?this.visibleOptions.slice(0,this.focusedOptionIndex).findIndex(function(e){return t.isOptionMatched(e)}):n+this.focusedOptionIndex),n===-1&&this.focusedOptionIndex===-1&&(n=this.findFirstFocusedOptionIndex()),n!==-1&&this.changeFocusedOptionIndex(e,n)),this.searchTimeout&&clearTimeout(this.searchTimeout),this.searchTimeout=setTimeout(function(){t.searchValue=``,t.searchTimeout=null},500)},changeFocusedOptionIndex:function(e,t){this.focusedOptionIndex!==t&&(this.focusedOptionIndex=t,this.scrollInView(),this.selectOnFocus&&this.onOptionSelect(e,this.visibleOptions[t]))},scrollInView:function(){var e=this,t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:-1;this.$nextTick(function(){var n=t===-1?e.focusedOptionId:`${e.$id}_${t}`,r=Ee(e.list,`li[id="${n}"]`);r?r.scrollIntoView&&r.scrollIntoView({block:`nearest`,inline:`nearest`}):e.virtualScrollerDisabled||e.virtualScroller&&e.virtualScroller.scrollToIndex(t===-1?e.focusedOptionIndex:t)})},autoUpdateModel:function(){if(this.autoOptionFocus&&(this.focusedOptionIndex=this.findFirstFocusedOptionIndex()),this.selectOnFocus&&this.autoOptionFocus&&!this.$filled){var e=this.getOptionValue(this.visibleOptions[this.focusedOptionIndex]);this.updateModel(null,[e])}},updateModel:function(e,t){this.writeValue(t,e),this.$emit(`change`,{originalEvent:e,value:t})},flatOptions:function(e){var t=this;return(e||[]).reduce(function(e,n,r){var i=t.getOptionGroupChildren(n);return i&&Array.isArray(i)?(e.push({optionGroup:n,group:!0,index:r}),i.forEach(function(t){return e.push(t)})):e.push(n),e},[])},overlayRef:function(e){this.overlay=e},listRef:function(e,t){this.list=e,t&&t(e)},virtualScrollerRef:function(e){this.virtualScroller=e}},computed:{visibleOptions:function(){var e=this,t=this.optionGroupLabel?this.flatOptions(this.options):this.options||[];if(this.filterValue){var n=ye.filter(t,this.searchFields,this.filterValue,this.filterMatchMode,this.filterLocale);if(this.optionGroupLabel){var r=this.options||[],i=[];return r.forEach(function(t){var r=e.getOptionGroupChildren(t).filter(function(e){return n.includes(e)});r.length>0&&i.push(it(it({},t),{},Z({},typeof e.optionGroupChildren==`string`?e.optionGroupChildren:`items`,st(r))))}),this.flatOptions(i)}return n}return t},label:function(){var e;if(this.d_value&&this.d_value.length){if(this.loading&&(!this.options||this.options.length===0))e=this.placeholder;else if(H(this.maxSelectedLabels)&&this.d_value.length>this.maxSelectedLabels)return this.getSelectedItemsLabel();else{e=``;for(var t=0;t<this.d_value.length;t++)t!==0&&(e+=`, `),e+=this.getLabelByValue(this.d_value[t])}}else e=this.placeholder;return e},chipSelectedItems:function(){return H(this.maxSelectedLabels)&&this.d_value&&this.d_value.length>this.maxSelectedLabels},allSelected:function(){var e=this;return this.selectAll===null?H(this.visibleOptions)&&this.visibleOptions.every(function(t){return e.isOptionGroup(t)||e.isOptionDisabled(t)||e.isSelected(t)}):this.selectAll},hasSelectedOption:function(){return this.$filled},equalityKey:function(){return this.optionValue?null:this.dataKey},searchFields:function(){return this.filterFields||[this.optionLabel]},maxSelectionLimitReached:function(){return this.selectionLimit&&this.d_value&&this.d_value.length===this.selectionLimit},filterResultMessageText:function(){return H(this.visibleOptions)?this.filterMessageText.replaceAll(`{0}`,this.visibleOptions.length):this.emptyFilterMessageText},filterMessageText:function(){return this.filterMessage||this.$primevue.config.locale.searchMessage||``},emptyFilterMessageText:function(){return this.emptyFilterMessage||this.$primevue.config.locale.emptySearchMessage||this.$primevue.config.locale.emptyFilterMessage||``},emptyMessageText:function(){return this.emptyMessage||this.$primevue.config.locale.emptyMessage||``},selectionMessageText:function(){return this.selectionMessage||this.$primevue.config.locale.selectionMessage||``},emptySelectionMessageText:function(){return this.emptySelectionMessage||this.$primevue.config.locale.emptySelectionMessage||``},selectedMessageText:function(){return this.$filled?this.selectionMessageText.replaceAll(`{0}`,this.d_value.length):this.emptySelectionMessageText},focusedOptionId:function(){return this.focusedOptionIndex===-1?null:`${this.$id}_${this.focusedOptionIndex}`},ariaSetSize:function(){var e=this;return this.visibleOptions.filter(function(t){return!e.isOptionGroup(t)}).length},toggleAllAriaLabel:function(){return this.$primevue.config.locale.aria?this.$primevue.config.locale.aria[this.allSelected?`selectAll`:`unselectAll`]:void 0},listAriaLabel:function(){return this.$primevue.config.locale.aria?this.$primevue.config.locale.aria.listLabel:void 0},virtualScrollerDisabled:function(){return!this.virtualScrollerOptions},hasFluid:function(){return Ce(this.fluid)?!!this.$pcFluid:this.fluid},isClearIconVisible:function(){return this.showClear&&this.d_value&&this.d_value.length&&this.d_value!=null&&H(this.options)&&!this.disabled&&!this.loading},containerDataP:function(){return W(Z({invalid:this.$invalid,disabled:this.disabled,focus:this.focused,fluid:this.$fluid,filled:this.$variant===`filled`},this.size,this.size))},labelDataP:function(){return W(Z(Z(Z({placeholder:this.label===this.placeholder,clearable:this.showClear,disabled:this.disabled},this.size,this.size),`has-chip`,this.display===`chip`&&this.d_value&&this.d_value.length&&(!this.maxSelectedLabels||this.d_value.length<=this.maxSelectedLabels)),`empty`,!this.placeholder&&!this.$filled))},dropdownIconDataP:function(){return W(Z({},this.size,this.size))},overlayDataP:function(){return W(Z({},`portal-`+this.appendTo,`portal-`+this.appendTo))}},directives:{ripple:we},components:{InputText:K,Checkbox:se,VirtualScroller:Be,Portal:ve,Chip:Ze,IconField:Fe,InputIcon:Ve,TimesIcon:je,SearchIcon:Le,ChevronDownIcon:Ue,SpinnerIcon:xe,CheckIcon:Ae}};function Q(e){"@babel/helpers - typeof";return Q=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},Q(e)}function mt(e,t,n){return(t=ht(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function ht(e){var t=gt(e,`string`);return Q(t)==`symbol`?t:t+``}function gt(e,t){if(Q(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t);if(Q(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}var _t=[`data-p`],vt=[`id`,`disabled`,`placeholder`,`tabindex`,`aria-label`,`aria-labelledby`,`aria-expanded`,`aria-controls`,`aria-activedescendant`,`aria-invalid`],yt=[`data-p`],bt={key:1},xt=[`data-p`],St=[`id`,`aria-label`],Ct=[`id`],wt=[`id`,`aria-label`,`aria-selected`,`aria-disabled`,`aria-setsize`,`aria-posinset`,`onClick`,`onMousemove`,`data-p-selected`,`data-p-focused`,`data-p-disabled`];function Tt(n,i,a,p,m,g){var b=f(`Chip`),x=f(`SpinnerIcon`),C=f(`Checkbox`),ee=f(`InputText`),te=f(`SearchIcon`),k=f(`InputIcon`),j=f(`IconField`),M=f(`VirtualScroller`),ne=f(`Portal`),N=e(`ripple`);return s(),T(`div`,o({ref:`container`,class:n.cx(`root`),style:n.sx(`root`),onClick:i[7]||=function(){return g.onContainerClick&&g.onContainerClick.apply(g,arguments)},"data-p":g.containerDataP},n.ptmi(`root`)),[r(`div`,o({class:`p-hidden-accessible`},n.ptm(`hiddenInputContainer`),{"data-p-hidden-accessible":!0}),[r(`input`,o({ref:`focusInput`,id:n.inputId,type:`text`,readonly:``,disabled:n.disabled,placeholder:n.placeholder,tabindex:n.disabled?-1:n.tabindex,role:`combobox`,"aria-label":n.ariaLabel,"aria-labelledby":n.ariaLabelledby,"aria-haspopup":`listbox`,"aria-expanded":m.overlayVisible,"aria-controls":m.overlayVisible?n.$id+`_list`:void 0,"aria-activedescendant":m.focused?g.focusedOptionId:void 0,"aria-invalid":n.invalid||void 0,onFocus:i[0]||=function(){return g.onFocus&&g.onFocus.apply(g,arguments)},onBlur:i[1]||=function(){return g.onBlur&&g.onBlur.apply(g,arguments)},onKeydown:i[2]||=function(){return g.onKeyDown&&g.onKeyDown.apply(g,arguments)}},n.ptm(`hiddenInput`)),null,16,vt)],16),r(`div`,o({class:n.cx(`labelContainer`)},n.ptm(`labelContainer`)),[r(`div`,o({class:n.cx(`label`),"data-p":g.labelDataP},n.ptm(`label`)),[y(n.$slots,`value`,{value:n.d_value,placeholder:n.placeholder},function(){return[n.display===`comma`?(s(),T(O,{key:0},[l(c(g.label||`empty`),1)],64)):n.display===`chip`?(s(),T(O,{key:1},[n.loading&&(!n.options||n.options.length===0)?(s(),T(O,{key:0},[l(c(n.placeholder||`empty`),1)],64)):g.chipSelectedItems?(s(),T(`span`,bt,c(g.label),1)):(s(!0),T(O,{key:2},v(n.d_value,function(e,t){return s(),T(`span`,o({key:`chip-${g.getLabelByValue(e)}_${t}`,class:n.cx(`chipItem`)},{ref_for:!0},n.ptm(`chipItem`)),[y(n.$slots,`chip`,{value:e,removeCallback:function(t){return g.removeOption(t,e)}},function(){return[d(b,{class:h(n.cx(`pcChip`)),label:g.getLabelByValue(e),removeIcon:n.chipIcon||n.removeTokenIcon,removable:``,unstyled:n.unstyled,onRemove:function(t){return g.removeOption(t,e)},pt:n.ptm(`pcChip`)},{removeicon:E(function(){return[y(n.$slots,n.$slots.chipicon?`chipicon`:`removetokenicon`,{class:h(n.cx(`chipIcon`)),item:e,removeCallback:function(t){return g.removeOption(t,e)}})]}),_:2},1032,[`class`,`label`,`removeIcon`,`unstyled`,`onRemove`,`pt`])]})],16)}),128)),!n.d_value||n.d_value.length===0?(s(),T(O,{key:3},[l(c(n.placeholder||`empty`),1)],64)):u(``,!0)],64)):u(``,!0)]})],16,yt)],16),g.isClearIconVisible?y(n.$slots,`clearicon`,{key:0,class:h(n.cx(`clearIcon`)),clearCallback:g.onClearClick},function(){return[(s(),t(S(n.clearIcon?`i`:`TimesIcon`),o({ref:`clearIcon`,class:[n.cx(`clearIcon`),n.clearIcon],onClick:g.onClearClick},n.ptm(`clearIcon`),{"data-pc-section":`clearicon`}),null,16,[`class`,`onClick`]))]}):u(``,!0),r(`div`,o({class:n.cx(`dropdown`)},n.ptm(`dropdown`)),[n.loading?y(n.$slots,`loadingicon`,{key:0,class:h(n.cx(`loadingIcon`))},function(){return[n.loadingIcon?(s(),T(`span`,o({key:0,class:[n.cx(`loadingIcon`),`pi-spin`,n.loadingIcon],"aria-hidden":`true`},n.ptm(`loadingIcon`)),null,16)):(s(),t(x,o({key:1,class:n.cx(`loadingIcon`),spin:``,"aria-hidden":`true`},n.ptm(`loadingIcon`)),null,16,[`class`]))]}):y(n.$slots,`dropdownicon`,{key:1,class:h(n.cx(`dropdownIcon`))},function(){return[(s(),t(S(n.dropdownIcon?`span`:`ChevronDownIcon`),o({class:[n.cx(`dropdownIcon`),n.dropdownIcon],"aria-hidden":`true`,"data-p":g.dropdownIconDataP},n.ptm(`dropdownIcon`)),null,16,[`class`,`data-p`]))]})],16),d(ne,{appendTo:n.appendTo},{default:E(function(){return[d(A,o({name:`p-anchored-overlay`,onEnter:g.onOverlayEnter,onAfterEnter:g.onOverlayAfterEnter,onLeave:g.onOverlayLeave,onAfterLeave:g.onOverlayAfterLeave},n.ptm(`transition`)),{default:E(function(){return[m.overlayVisible?(s(),T(`div`,o({key:0,ref:g.overlayRef,style:[n.panelStyle,n.overlayStyle],class:[n.cx(`overlay`),n.panelClass,n.overlayClass],onClick:i[5]||=function(){return g.onOverlayClick&&g.onOverlayClick.apply(g,arguments)},onKeydown:i[6]||=function(){return g.onOverlayKeyDown&&g.onOverlayKeyDown.apply(g,arguments)},"data-p":g.overlayDataP},n.ptm(`overlay`)),[r(`span`,o({ref:`firstHiddenFocusableElementOnOverlay`,role:`presentation`,"aria-hidden":`true`,class:`p-hidden-accessible p-hidden-focusable`,tabindex:0,onFocus:i[3]||=function(){return g.onFirstHiddenFocus&&g.onFirstHiddenFocus.apply(g,arguments)}},n.ptm(`hiddenFirstFocusableEl`),{"data-p-hidden-accessible":!0,"data-p-hidden-focusable":!0}),null,16),y(n.$slots,`header`,{value:n.d_value,options:g.visibleOptions}),n.showToggleAll&&n.selectionLimit==null||n.filter?(s(),T(`div`,o({key:0,class:n.cx(`header`)},n.ptm(`header`)),[n.showToggleAll&&n.selectionLimit==null?(s(),t(C,{key:0,modelValue:g.allSelected,binary:!0,disabled:n.disabled,variant:n.variant,"aria-label":g.toggleAllAriaLabel,onChange:g.onToggleAll,unstyled:n.unstyled,pt:g.getHeaderCheckboxPTOptions(`pcHeaderCheckbox`),formControl:{novalidate:!0}},{icon:E(function(e){return[n.$slots.headercheckboxicon?(s(),t(S(n.$slots.headercheckboxicon),{key:0,checked:e.checked,class:h(e.class)},null,8,[`checked`,`class`])):e.checked?(s(),t(S(n.checkboxIcon?`span`:`CheckIcon`),o({key:1,class:[e.class,mt({},n.checkboxIcon,e.checked)]},g.getHeaderCheckboxPTOptions(`pcHeaderCheckbox.icon`)),null,16,[`class`])):u(``,!0)]}),_:1},8,[`modelValue`,`disabled`,`variant`,`aria-label`,`onChange`,`unstyled`,`pt`])):u(``,!0),n.filter?(s(),t(j,{key:1,class:h(n.cx(`pcFilterContainer`)),unstyled:n.unstyled,pt:n.ptm(`pcFilterContainer`)},{default:E(function(){return[d(ee,{ref:`filterInput`,value:m.filterValue,onVnodeMounted:g.onFilterUpdated,onVnodeUpdated:g.onFilterUpdated,class:h(n.cx(`pcFilter`)),placeholder:n.filterPlaceholder,disabled:n.disabled,variant:n.variant,unstyled:n.unstyled,role:`searchbox`,autocomplete:`off`,"aria-owns":n.$id+`_list`,"aria-activedescendant":g.focusedOptionId,onKeydown:g.onFilterKeyDown,onBlur:g.onFilterBlur,onInput:g.onFilterChange,pt:n.ptm(`pcFilter`),formControl:{novalidate:!0}},null,8,[`value`,`onVnodeMounted`,`onVnodeUpdated`,`class`,`placeholder`,`disabled`,`variant`,`unstyled`,`aria-owns`,`aria-activedescendant`,`onKeydown`,`onBlur`,`onInput`,`pt`]),d(k,{unstyled:n.unstyled,pt:n.ptm(`pcFilterIconContainer`)},{default:E(function(){return[y(n.$slots,`filtericon`,{},function(){return[n.filterIcon?(s(),T(`span`,o({key:0,class:n.filterIcon},n.ptm(`filterIcon`)),null,16)):(s(),t(te,_(o({key:1},n.ptm(`filterIcon`))),null,16))]})]}),_:3},8,[`unstyled`,`pt`])]}),_:3},8,[`class`,`unstyled`,`pt`])):u(``,!0),n.filter?(s(),T(`span`,o({key:2,role:`status`,"aria-live":`polite`,class:`p-hidden-accessible`},n.ptm(`hiddenFilterResult`),{"data-p-hidden-accessible":!0}),c(g.filterResultMessageText),17)):u(``,!0)],16)):u(``,!0),r(`div`,o({class:n.cx(`listContainer`),style:{"max-height":g.virtualScrollerDisabled?n.scrollHeight:``}},n.ptm(`listContainer`)),[d(M,o({ref:g.virtualScrollerRef},n.virtualScrollerOptions,{items:g.visibleOptions,style:{height:n.scrollHeight},tabindex:-1,disabled:g.virtualScrollerDisabled,pt:n.ptm(`virtualScroller`)}),w({content:E(function(e){var i=e.styleClass,a=e.contentRef,f=e.items,p=e.getItemOptions,_=e.contentStyle,b=e.itemSize;return[r(`ul`,o({ref:function(e){return g.listRef(e,a)},id:n.$id+`_list`,class:[n.cx(`list`),i],style:_,role:`listbox`,"aria-multiselectable":`true`,"aria-label":g.listAriaLabel},n.ptm(`list`)),[(s(!0),T(O,null,v(f,function(e,i){return s(),T(O,{key:g.getOptionRenderKey(e,g.getOptionIndex(i,p))},[g.isOptionGroup(e)?(s(),T(`li`,o({key:0,id:n.$id+`_`+g.getOptionIndex(i,p),style:{height:b?b+`px`:void 0},class:n.cx(`optionGroup`),role:`option`},{ref_for:!0},n.ptm(`optionGroup`)),[y(n.$slots,`optiongroup`,{option:e.optionGroup,index:g.getOptionIndex(i,p)},function(){return[l(c(g.getOptionGroupLabel(e.optionGroup)),1)]})],16,Ct)):D((s(),T(`li`,o({key:1,id:n.$id+`_`+g.getOptionIndex(i,p),style:{height:b?b+`px`:void 0},class:n.cx(`option`,{option:e,index:i,getItemOptions:p}),role:`option`,"aria-label":g.getOptionLabel(e),"aria-selected":g.isSelected(e),"aria-disabled":g.isOptionDisabled(e),"aria-setsize":g.ariaSetSize,"aria-posinset":g.getAriaPosInset(g.getOptionIndex(i,p)),onClick:function(t){return g.onOptionSelect(t,e,g.getOptionIndex(i,p),!0)},onMousemove:function(e){return g.onOptionMouseMove(e,g.getOptionIndex(i,p))}},{ref_for:!0},g.getCheckboxPTOptions(e,p,i,`option`),{"data-p-selected":g.isSelected(e),"data-p-focused":m.focusedOptionIndex===g.getOptionIndex(i,p),"data-p-disabled":g.isOptionDisabled(e)}),[d(C,{defaultValue:g.isSelected(e),binary:!0,tabindex:-1,variant:n.variant,unstyled:n.unstyled,pt:g.getCheckboxPTOptions(e,p,i,`pcOptionCheckbox`),formControl:{novalidate:!0}},{icon:E(function(r){return[n.$slots.optioncheckboxicon||n.$slots.itemcheckboxicon?(s(),t(S(n.$slots.optioncheckboxicon||n.$slots.itemcheckboxicon),{key:0,checked:r.checked,class:h(r.class)},null,8,[`checked`,`class`])):r.checked?(s(),t(S(n.checkboxIcon?`span`:`CheckIcon`),o({key:1,class:[r.class,mt({},n.checkboxIcon,r.checked)]},{ref_for:!0},g.getCheckboxPTOptions(e,p,i,`pcOptionCheckbox.icon`)),null,16,[`class`])):u(``,!0)]}),_:2},1032,[`defaultValue`,`variant`,`unstyled`,`pt`]),y(n.$slots,`option`,{option:e,selected:g.isSelected(e),index:g.getOptionIndex(i,p)},function(){return[r(`span`,o({ref_for:!0},n.ptm(`optionLabel`)),c(g.getOptionLabel(e)),17)]})],16,wt)),[[N]])],64)}),128)),m.filterValue&&(!f||f&&f.length===0)?(s(),T(`li`,o({key:0,class:n.cx(`emptyMessage`),role:`option`},n.ptm(`emptyMessage`)),[y(n.$slots,`emptyfilter`,{},function(){return[l(c(g.emptyFilterMessageText),1)]})],16)):!n.options||n.options&&n.options.length===0?(s(),T(`li`,o({key:1,class:n.cx(`emptyMessage`),role:`option`},n.ptm(`emptyMessage`)),[y(n.$slots,`empty`,{},function(){return[l(c(g.emptyMessageText),1)]})],16)):u(``,!0)],16,St)]}),_:2},[n.$slots.loader?{name:`loader`,fn:E(function(e){var t=e.options;return[y(n.$slots,`loader`,{options:t})]}),key:`0`}:void 0]),1040,[`items`,`style`,`disabled`,`pt`])],16),y(n.$slots,`footer`,{value:n.d_value,options:g.visibleOptions}),!n.options||n.options&&n.options.length===0?(s(),T(`span`,o({key:1,role:`status`,"aria-live":`polite`,class:`p-hidden-accessible`},n.ptm(`hiddenEmptyMessage`),{"data-p-hidden-accessible":!0}),c(g.emptyMessageText),17)):u(``,!0),r(`span`,o({role:`status`,"aria-live":`polite`,class:`p-hidden-accessible`},n.ptm(`hiddenSelectedMessage`),{"data-p-hidden-accessible":!0}),c(g.selectedMessageText),17),r(`span`,o({ref:`lastHiddenFocusableElementOnOverlay`,role:`presentation`,"aria-hidden":`true`,class:`p-hidden-accessible p-hidden-focusable`,tabindex:0,onFocus:i[4]||=function(){return g.onLastHiddenFocus&&g.onLastHiddenFocus.apply(g,arguments)}},n.ptm(`hiddenLastFocusableEl`),{"data-p-hidden-accessible":!0,"data-p-hidden-focusable":!0}),null,16)],16,xt)):u(``,!0)]}),_:3},16,[`onEnter`,`onAfterEnter`,`onLeave`,`onAfterLeave`])]}),_:3},8,[`appendTo`])],16,_t)}pt.render=Tt;var Et=B.extend({name:`popover`,style:`
    .p-popover {
        margin-block-start: dt('popover.gutter');
        background: dt('popover.background');
        color: dt('popover.color');
        border: 1px solid dt('popover.border.color');
        border-radius: dt('popover.border.radius');
        box-shadow: dt('popover.shadow');
        will-change: transform;
    }

    .p-popover-content {
        padding: dt('popover.content.padding');
    }

    .p-popover-flipped {
        margin-block-start: calc(dt('popover.gutter') * -1);
        margin-block-end: dt('popover.gutter');
    }

    .p-popover:after,
    .p-popover:before {
        bottom: 100%;
        left: calc(dt('popover.arrow.offset') + dt('popover.arrow.left'));
        content: ' ';
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
    }

    .p-popover:after {
        border-width: calc(dt('popover.gutter') - 2px);
        margin-left: calc(-1 * (dt('popover.gutter') - 2px));
        border-style: solid;
        border-color: transparent;
        border-bottom-color: dt('popover.background');
    }

    .p-popover:before {
        border-width: dt('popover.gutter');
        margin-left: calc(-1 * dt('popover.gutter'));
        border-style: solid;
        border-color: transparent;
        border-bottom-color: dt('popover.border.color');
    }

    .p-popover-flipped:after,
    .p-popover-flipped:before {
        bottom: auto;
        top: 100%;
    }

    .p-popover.p-popover-flipped:after {
        border-bottom-color: transparent;
        border-top-color: dt('popover.background');
    }

    .p-popover.p-popover-flipped:before {
        border-bottom-color: transparent;
        border-top-color: dt('popover.border.color');
    }
`,classes:{root:`p-popover p-component`,content:`p-popover-content`}}),$={name:`Popover`,extends:{name:`BasePopover`,extends:ke,props:{dismissable:{type:Boolean,default:!0},appendTo:{type:[String,Object],default:`body`},baseZIndex:{type:Number,default:0},autoZIndex:{type:Boolean,default:!0},breakpoints:{type:Object,default:null},closeOnEscape:{type:Boolean,default:!0}},style:Et,provide:function(){return{$pcPopover:this,$parentInstance:this}}},inheritAttrs:!1,emits:[`show`,`hide`],data:function(){return{visible:!1}},watch:{dismissable:{immediate:!0,handler:function(e){e?this.bindOutsideClickListener():this.unbindOutsideClickListener()}}},selfClick:!1,target:null,eventTarget:null,outsideClickListener:null,scrollHandler:null,resizeListener:null,container:null,styleElement:null,overlayEventListener:null,documentKeydownListener:null,contentResizeObserver:null,beforeUnmount:function(){this.dismissable&&this.unbindOutsideClickListener(),this.scrollHandler&&=(this.scrollHandler.destroy(),null),this.destroyStyle(),this.unbindResizeListener(),this.unbindContentResizeListener(),this.target=null,this.container&&this.autoZIndex&&R.clear(this.container),this.overlayEventListener&&=(q.off(`overlay-click`,this.overlayEventListener),null),this.container=null},mounted:function(){this.breakpoints&&this.createStyle()},methods:{toggle:function(e,t){this.visible?this.hide():this.show(e,t)},show:function(e,t){this.visible=!0,this.eventTarget=e.currentTarget,this.target=t||e.currentTarget},hide:function(){this.visible=!1},onContentClick:function(){this.selfClick=!0},onEnter:function(e){var t=this;Pe(e,{position:`absolute`,top:`0`}),this.alignOverlay(),this.dismissable&&this.bindOutsideClickListener(),this.bindScrollListener(),this.bindResizeListener(),this.autoZIndex&&R.set(`overlay`,e,this.baseZIndex||this.$primevue.config.zIndex.overlay),this.overlayEventListener=function(e){t.container.contains(e.target)&&(t.selfClick=!0)},this.bindContentResizeListener(),this.focus(),q.on(`overlay-click`,this.overlayEventListener),this.$emit(`show`),this.closeOnEscape&&this.bindDocumentKeyDownListener()},onLeave:function(){this.unbindOutsideClickListener(),this.unbindScrollListener(),this.unbindResizeListener(),this.unbindDocumentKeyDownListener(),this.unbindContentResizeListener(),q.off(`overlay-click`,this.overlayEventListener),this.overlayEventListener=null,this.$emit(`hide`)},onAfterLeave:function(e){this.autoZIndex&&R.clear(e)},alignOverlay:function(){L(this.container,this.target,!1);var e=ge(this.container),t=ge(this.target),n=0;e.left<t.left&&(n=t.left-e.left),this.container.style.setProperty(Ne(`popover.arrow.left`).name,`${n}px`),e.top<t.top&&(this.container.setAttribute(`data-p-popover-flipped`,`true`),!this.isUnstyled&&pe(this.container,`p-popover-flipped`))},onContentKeydown:function(e){e.code===`Escape`&&this.closeOnEscape&&(this.hide(),z(this.target))},onButtonKeydown:function(e){switch(e.code){case`ArrowDown`:case`ArrowUp`:case`ArrowLeft`:case`ArrowRight`:e.preventDefault()}},focus:function(){var e=this.container.querySelector(`[autofocus]`);e&&e.focus()},onKeyDown:function(e){e.code===`Escape`&&this.closeOnEscape&&(this.visible=!1)},bindDocumentKeyDownListener:function(){this.documentKeydownListener||(this.documentKeydownListener=this.onKeyDown.bind(this),window.document.addEventListener(`keydown`,this.documentKeydownListener))},unbindDocumentKeyDownListener:function(){this.documentKeydownListener&&=(window.document.removeEventListener(`keydown`,this.documentKeydownListener),null)},bindOutsideClickListener:function(){var e=this;!this.outsideClickListener&&ue()&&(this.outsideClickListener=function(t){e.visible&&!e.selfClick&&!e.isTargetClicked(t)&&(e.visible=!1),e.selfClick=!1},document.addEventListener(`click`,this.outsideClickListener))},unbindOutsideClickListener:function(){this.outsideClickListener&&(document.removeEventListener(`click`,this.outsideClickListener),this.outsideClickListener=null,this.selfClick=!1)},bindScrollListener:function(){var e=this;this.scrollHandler||=new Ie(this.target,function(){e.visible&&=!1}),this.scrollHandler.bindScrollListener()},unbindScrollListener:function(){this.scrollHandler&&this.scrollHandler.unbindScrollListener()},bindResizeListener:function(){var e=this;this.resizeListener||(this.resizeListener=function(){e.visible&&!fe()&&(e.visible=!1)},window.addEventListener(`resize`,this.resizeListener))},unbindResizeListener:function(){this.resizeListener&&=(window.removeEventListener(`resize`,this.resizeListener),null)},bindContentResizeListener:function(){var e=this;this.contentResizeObserver||(this.contentResizeObserver=new ResizeObserver(function(){e.visible&&e.alignOverlay()}),this.contentResizeObserver.observe(this.container))},unbindContentResizeListener:function(){this.contentResizeObserver&&=(this.contentResizeObserver.disconnect(),null)},isTargetClicked:function(e){return this.eventTarget&&(this.eventTarget===e.target||this.eventTarget.contains(e.target))},containerRef:function(e){this.container=e},createStyle:function(){if(!this.styleElement&&!this.isUnstyled){var e;this.styleElement=document.createElement(`style`),this.styleElement.type=`text/css`,he(this.styleElement,`nonce`,(e=this.$primevue)==null||(e=e.config)==null||(e=e.csp)==null?void 0:e.nonce),document.head.appendChild(this.styleElement);var t=``;for(var n in this.breakpoints)t+=`
                        @media screen and (max-width: ${n}) {
                            .p-popover[${this.$attrSelector}] {
                                width: ${this.breakpoints[n]} !important;
                            }
                        }
                    `;this.styleElement.innerHTML=t}},destroyStyle:function(){this.styleElement&&=(document.head.removeChild(this.styleElement),null)},onOverlayClick:function(e){q.emit(`overlay-click`,{originalEvent:e,target:this.target})}},directives:{focustrap:De,ripple:we},components:{Portal:ve}},Dt=[`aria-modal`];function Ot(n,r,i,a,c,l){var p=f(`Portal`),m=e(`focustrap`);return s(),t(p,{appendTo:n.appendTo},{default:E(function(){return[d(A,o({name:`p-anchored-overlay`,onEnter:l.onEnter,onLeave:l.onLeave,onAfterLeave:l.onAfterLeave},n.ptm(`transition`)),{default:E(function(){return[c.visible?D((s(),T(`div`,o({key:0,ref:l.containerRef,role:`dialog`,"aria-modal":c.visible,onClick:r[3]||=function(){return l.onOverlayClick&&l.onOverlayClick.apply(l,arguments)},class:n.cx(`root`)},n.ptmi(`root`)),[n.$slots.container?y(n.$slots,`container`,{key:0,closeCallback:l.hide,keydownCallback:function(e){return l.onButtonKeydown(e)}}):(s(),T(`div`,o({key:1,class:n.cx(`content`),onClick:r[0]||=function(){return l.onContentClick&&l.onContentClick.apply(l,arguments)},onMousedown:r[1]||=function(){return l.onContentClick&&l.onContentClick.apply(l,arguments)},onKeydown:r[2]||=function(){return l.onContentKeydown&&l.onContentKeydown.apply(l,arguments)}},n.ptm(`content`)),[y(n.$slots,`default`)],16))],16,Dt)),[[m]]):u(``,!0)]}),_:3},16,[`onEnter`,`onLeave`,`onAfterLeave`])]}),_:3},8,[`appendTo`])}$.render=Ot;function kt(e,t){return{list:()=>P.get(`/${e}/list`).then(t=>t[e]??[]),create:n=>P.post(`/${e}`,{[t]:{name:n}}),update:(n,r)=>P.put(`/${e}/${n}`,{[t]:{name:r}}),remove:t=>P.delete(`/${e}/${t}`)}}var At=kt(`sizes`,`size`),jt=kt(`colors`,`color`),Mt={class:`w-64`,"data-testid":`item-editor`},Nt={key:0,class:`max-h-60 overflow-y-auto`},Pt=[`onClick`],Ft={key:1,class:`text-center font-bold`},It=i({__name:`ItemEditor`,props:{api:{},items:{},deleteMessage:{}},emits:[`changed`],setup(e,{emit:r}){let i=e,a=r,{t:o}=M(),l=F(),{run:u}=Ke(),f=x(``),p=x(),h=x(``),g=x();async function _(){let e=f.value.trim();e&&await u(()=>i.api.create(e))&&(f.value=``,a(`changed`))}async function y(e){p.value=e.id,h.value=e.name,await m(),g.value?.[0]?.$el.focus()}async function b(e){let t=h.value.trim();if(p.value=void 0,!t)return S(e);t!==e.name&&await u(()=>i.api.update(e.id,t))&&a(`changed`)}let S=e=>l(i.deleteMessage,async()=>{await u(()=>i.api.remove(e.id))&&a(`changed`)});return(r,i)=>(s(),T(`div`,Mt,[d(n(K),{modelValue:f.value,"onUpdate:modelValue":i[0]||=e=>f.value=e,class:`mb-2 w-full`,placeholder:n(o)(`ENTER`),"data-testid":`item-new`,onKeydown:j(N(_,[`prevent`]),[`enter`])},null,8,[`modelValue`,`placeholder`,`onKeydown`]),e.items.length?(s(),T(`ul`,Nt,[(s(!0),T(O,null,v(e.items,e=>(s(),T(`li`,{key:e.id,class:`border-t border-border py-1`},[p.value===e.id?(s(),t(n(K),{key:0,ref_for:!0,ref_key:`editInput`,ref:g,modelValue:h.value,"onUpdate:modelValue":i[1]||=e=>h.value=e,class:`w-full`,placeholder:n(o)(`ENTER`),"data-testid":`item-edit`,onKeydown:[j(N(t=>b(e),[`prevent`]),[`enter`]),i[2]||=j(e=>p.value=void 0,[`esc`])]},null,8,[`modelValue`,`placeholder`,`onKeydown`])):(s(),T(`button`,{key:1,type:`button`,class:`w-full cursor-pointer text-left`,"data-testid":`item-name`,onClick:t=>y(e)},c(e.name),9,Pt))]))),128))])):(s(),T(`p`,Ft,c(n(o)(`NO_RECORDS_FOUND`)),1))]))}}),Lt={class:`flex gap-2`},Rt={class:`flex gap-2`},zt={class:`flex gap-2`},Bt={class:`mt-4 flex flex-wrap gap-4`,"data-testid":`product-images`},Vt={class:`mb-1 flex cursor-pointer items-center justify-center gap-1 text-sm`},Ht=[`checked`,`aria-label`,`onChange`],Ut=[`onClick`],Wt=[`src`],Gt=i({__name:`ProductEditor`,props:g({collectionSlug:{},product:{},startTab:{}},{visible:{type:Boolean,required:!0},visibleModifiers:{}}),emits:g([`closed`],[`update:visible`]),setup(e,{emit:i}){let a=e,o=b(e,`visible`),u=i,f=ne[0],{t:m}=M(),h=He(),g=F(),{busy:_,run:y}=Ke(),S=x(),C=x(`basic`),w=x([]),D=x([]),k=te({name:``,description:``,published:!1,is_top:!1,size_ids:[],color_ids:[],price:null,currency:f}),A=x(),j=x();async function N(){w.value=await y(()=>At.list())??[]}async function P(){D.value=await y(()=>jt.list())??[]}function re(){let e=a.product;S.value=e,C.value=a.startTab??`basic`,k.name=e?.name??``,k.description=e?.description??``,k.published=!!e?.published,k.is_top=!!e?.is_top,k.size_ids=[...e?.size_ids??[]],k.color_ids=[...e?.color_ids??[]],k.price=e?.price??null,k.currency=e?.currency??f,N(),P()}ee(o,e=>e&&re(),{immediate:!0});let ae=p(()=>!!S.value),ce=p(()=>k.name.trim()!==``),le=()=>({...k,currency:k.price?k.currency:null}),ue=p(()=>S.value?.images??[]);async function de(){let e=S.value;if(e){if(!await y(()=>Y.update(a.collectionSlug,e.slug,le())))return;h.updated(`PRODUCT`),o.value=!1}else{let e=await y(()=>Y.create(a.collectionSlug,le()));if(!e)return;S.value=e,h.created(`PRODUCT`),C.value=`images`}}async function L(e){let t=S.value;if(!t||e.is_cover)return;let n=await y(()=>Ye.makeCover(a.collectionSlug,t.slug,e.id));n&&(S.value=n,h.imageMadeCover())}async function fe(e){let t=S.value;if(!t)return;let n=await y(()=>Ye.upload(a.collectionSlug,t.slug,e));n&&(S.value={...t,images:n.images},h.imageUploaded(),n.images.length===1&&n.images[0]&&await L(n.images[0]))}let pe=e=>g(`DELETE_IMAGE_MESSAGE`,async()=>{let t=S.value;if(!t)return;let n=await y(()=>Ye.remove(a.collectionSlug,t.slug,e.id));n&&(S.value=n,h.imageDeleted())});return(e,i)=>(s(),t(oe,{visible:o.value,"onUpdate:visible":i[10]||=e=>o.value=e,tab:C.value,"onUpdate:tab":i[11]||=e=>C.value=e,title:`PRODUCT`,"is-edit":ae.value,saving:n(_),"can-save":ce.value,"image-tab":``,onSave:de,onClose:i[12]||=e=>u(`closed`)},{basic:E(()=>[d(I,{label:n(m)(`NAME`),for:`product-name`,required:``},{default:E(()=>[d(n(K),{id:`product-name`,modelValue:k.name,"onUpdate:modelValue":i[0]||=e=>k.name=e,class:`w-full`,placeholder:n(m)(`ENTER_PRODUCT_NAME`),autofocus:``},null,8,[`modelValue`,`placeholder`])]),_:1},8,[`label`]),d(I,{label:n(m)(`DESCRIPTION`),for:`product-description`},{default:E(()=>[d(n(We),{id:`product-description`,modelValue:k.description,"onUpdate:modelValue":i[1]||=e=>k.description=e,rows:`4`,class:`w-full`,placeholder:n(m)(`ENTER_DESCRIPTION`)},null,8,[`modelValue`,`placeholder`])]),_:1},8,[`label`]),d(I,{label:n(m)(`SIZE`),for:`product-sizes`},{default:E(()=>[r(`div`,Lt,[d(n(pt),{modelValue:k.size_ids,"onUpdate:modelValue":i[2]||=e=>k.size_ids=e,"input-id":`product-sizes`,options:w.value,"option-label":`name`,"option-value":`id`,placeholder:n(m)(`CHOOSE`),display:`chip`,class:`min-w-0 flex-1`},null,8,[`modelValue`,`options`,`placeholder`]),d(n(be),{label:n(m)(`ADD_SIZE`),severity:`secondary`,outlined:``,"data-testid":`add-size`,onClick:i[3]||=e=>A.value?.toggle(e)},null,8,[`label`])]),d(n($),{ref_key:`sizePopover`,ref:A},{default:E(()=>[d(It,{api:n(At),items:w.value,"delete-message":`DELETE_SIZE_MESSAGE`,onChanged:N},null,8,[`api`,`items`])]),_:1},512)]),_:1},8,[`label`]),d(I,{label:n(m)(`COLOR`),for:`product-colors`},{default:E(()=>[r(`div`,Rt,[d(n(pt),{modelValue:k.color_ids,"onUpdate:modelValue":i[4]||=e=>k.color_ids=e,"input-id":`product-colors`,options:D.value,"option-label":`name`,"option-value":`id`,placeholder:n(m)(`CHOOSE`),display:`chip`,class:`min-w-0 flex-1`},null,8,[`modelValue`,`options`,`placeholder`]),d(n(be),{label:n(m)(`ADD_COLOR`),severity:`secondary`,outlined:``,"data-testid":`add-color`,onClick:i[5]||=e=>j.value?.toggle(e)},null,8,[`label`])]),d(n($),{ref_key:`colorPopover`,ref:j},{default:E(()=>[d(It,{api:n(jt),items:D.value,"delete-message":`DELETE_COLOR_MESSAGE`,onChanged:P},null,8,[`api`,`items`])]),_:1},512)]),_:1},8,[`label`]),d(I,{label:n(m)(`PRICE`),for:`product-price`},{default:E(()=>[r(`div`,zt,[d(n(ie),{modelValue:k.price,"onUpdate:modelValue":i[6]||=e=>k.price=e,"input-id":`product-price`,min:1,"max-fraction-digits":0,"use-grouping":``,class:`min-w-0 flex-1`,"input-class":`w-full`},null,8,[`modelValue`]),d(n(Re),{modelValue:k.currency,"onUpdate:modelValue":i[7]||=e=>k.currency=e,"input-id":`product-currency`,options:[...n(ne)],"aria-label":n(m)(`CURRENCY`),disabled:!k.price,class:`w-28`},null,8,[`modelValue`,`options`,`aria-label`,`disabled`])])]),_:1},8,[`label`]),d(I,{label:n(m)(`PUBLISHED`),for:`product-published`},{default:E(()=>[d(n(se),{modelValue:k.published,"onUpdate:modelValue":i[8]||=e=>k.published=e,"input-id":`product-published`,binary:``},null,8,[`modelValue`])]),_:1},8,[`label`]),d(I,{label:n(m)(`TOP_PRODUCT`),for:`product-top`},{default:E(()=>[d(n(se),{modelValue:k.is_top,"onUpdate:modelValue":i[9]||=e=>k.is_top=e,"input-id":`product-top`,binary:``},null,8,[`modelValue`])]),_:1},8,[`label`])]),images:E(()=>[d(Ge,{uploading:n(_),onUpload:fe},null,8,[`uploading`]),r(`div`,Bt,[(s(!0),T(O,null,v(ue.value,e=>(s(),T(`div`,{key:e.id,class:`w-40 text-center`,"data-testid":`product-image`},[r(`label`,Vt,[r(`input`,{type:`radio`,name:`cover`,checked:!!e.is_cover,"aria-label":e.is_cover?n(m)(`COVER`):n(m)(`MAKE_COVER`),"data-testid":`image-cover`,onChange:t=>L(e)},null,40,Ht),l(` `+c(e.is_cover?n(m)(`COVER`):n(m)(`MAKE_COVER`)),1)]),r(`button`,{type:`button`,class:`mb-1 block w-full cursor-pointer border border-border p-1`,onClick:t=>L(e)},[r(`img`,{src:e.url,alt:``,class:`mx-auto max-h-40 max-w-full`},null,8,Wt)],8,Ut),d(n(be),{label:n(m)(`DELETE`),severity:`danger`,size:`small`,"data-testid":`image-delete`,onClick:t=>pe(e)},null,8,[`label`,`onClick`])]))),128))])]),_:1},8,[`visible`,`tab`,`is-edit`,`saving`,`can-save`]))}}),Kt=i({__name:`CollectionProductsView`,setup(e){let t=[{field:`cover_image`,header:`COVER`,kind:`image`,width:`120px`},{field:`name`,header:`NAME`,sortable:!0},{field:`description`,header:`DESCRIPTION`,sortable:!0},{field:`price`,header:`PRICE`,kind:`price`,sortable:!0,width:`140px`},{field:`updated_at`,header:`EDIT_DATE`,kind:`date`,sortable:!0,width:`200px`}],r=C(),i=He(),o=F(),{run:c}=Ke(),l=p(()=>String(r.params.collectionId)),u=ce({basePath:()=>`/collection/${encodeURIComponent(l.value)}/products`,sortFields:[`name`,`description`,`price`,`published`,`updated_at`]}),f=qe(async()=>{let e=await k.get(l.value);return{parentName:e.name,items:e.products??[]}},u,`name`);a(()=>c(f.reload)),ee(l,()=>c(f.reload));let m=x(!1),h=x(),g=x(`basic`);async function _(e,t){let n=e?await c(()=>Y.get(l.value,e.slug)):void 0;(!e||n)&&(h.value=n,g.value=t,m.value=!0)}let v=e=>o(`DELETE_PRODUCT_MESSAGE`,async()=>{await c(()=>Y.remove(l.value,e.slug))&&(i.deleted(`PRODUCT`),await c(f.reload))});async function y(e,t){await c(()=>Y.update(l.value,e.slug,{name:e.name,description:e.description??void 0,is_top:e.is_top,size_ids:e.size_ids,color_ids:e.color_ids,published:t}))&&(e.published=t,i.published(`PRODUCT`,t))}return(e,r)=>(s(),T(O,null,[d(le,{title:`PRODUCTS`,"parent-kind":`COLLECTION`,"parent-name":n(f).parentName.value},null,8,[`parent-name`]),d(re,{"search-input":n(u).searchInput.value,"onUpdate:searchInput":r[2]||=e=>n(u).searchInput.value=e,"search-placeholder":`SEARCH_BY_NAME`,"add-label":`ADD_PRODUCT`,onSearch:n(u).search,onClear:n(u).clearSearch,onAdd:r[3]||=e=>_(void 0,`basic`)},{default:E(()=>[d(ae,{columns:t,rows:n(f).rows.value,"total-count":n(f).totalCount.value,"sort-by":n(u).sortBy.value,"sort-direction":n(u).sortDirection.value,loading:n(f).loading.value,"toggle-published":y,published:``,upload:``,onSort:n(u).sort,onEdit:r[0]||=e=>_(e,`basic`),onUpload:r[1]||=e=>_(e,`images`),onDelete:v},null,8,[`rows`,`total-count`,`sort-by`,`sort-direction`,`loading`,`onSort`])]),_:1},8,[`search-input`,`onSearch`,`onClear`]),d(Gt,{visible:m.value,"onUpdate:visible":r[4]||=e=>m.value=e,"collection-slug":l.value,product:h.value,"start-tab":g.value,onClosed:r[5]||=e=>n(c)(n(f).reload)},null,8,[`visible`,`collection-slug`,`product`,`start-tab`])],64))}});export{Kt as default};