import{Dt as e,E as t,F as n,H as r,J as i,P as a,bt as o,k as s}from"./useApi-CUWMwLLw-CdB9agTY.js";import{b as c}from"./vue-router-CkfviPMk.js";import{_ as l,c as u,rt as d}from"./admin-CJk9UxOc.js";import{o as f}from"./useNotify-DcPhce6q.js";var p=l.extend({name:`textarea`,style:`
    .p-textarea {
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: dt('textarea.color');
        background: dt('textarea.background');
        padding-block: dt('textarea.padding.y');
        padding-inline: dt('textarea.padding.x');
        border: 1px solid dt('textarea.border.color');
        transition:
            background dt('textarea.transition.duration'),
            color dt('textarea.transition.duration'),
            border-color dt('textarea.transition.duration'),
            outline-color dt('textarea.transition.duration'),
            box-shadow dt('textarea.transition.duration');
        appearance: none;
        border-radius: dt('textarea.border.radius');
        outline-color: transparent;
        box-shadow: dt('textarea.shadow');
    }

    .p-textarea:enabled:hover {
        border-color: dt('textarea.hover.border.color');
    }

    .p-textarea:enabled:focus {
        border-color: dt('textarea.focus.border.color');
        box-shadow: dt('textarea.focus.ring.shadow');
        outline: dt('textarea.focus.ring.width') dt('textarea.focus.ring.style') dt('textarea.focus.ring.color');
        outline-offset: dt('textarea.focus.ring.offset');
    }

    .p-textarea.p-invalid {
        border-color: dt('textarea.invalid.border.color');
    }

    .p-textarea.p-variant-filled {
        background: dt('textarea.filled.background');
    }

    .p-textarea.p-variant-filled:enabled:hover {
        background: dt('textarea.filled.hover.background');
    }

    .p-textarea.p-variant-filled:enabled:focus {
        background: dt('textarea.filled.focus.background');
    }

    .p-textarea:disabled {
        opacity: 1;
        background: dt('textarea.disabled.background');
        color: dt('textarea.disabled.color');
    }

    .p-textarea::placeholder {
        color: dt('textarea.placeholder.color');
    }

    .p-textarea.p-invalid::placeholder {
        color: dt('textarea.invalid.placeholder.color');
    }

    .p-textarea-fluid {
        width: 100%;
    }

    .p-textarea-resizable {
        overflow: hidden;
        resize: none;
    }

    .p-textarea-sm {
        font-size: dt('textarea.sm.font.size');
        padding-block: dt('textarea.sm.padding.y');
        padding-inline: dt('textarea.sm.padding.x');
    }

    .p-textarea-lg {
        font-size: dt('textarea.lg.font.size');
        padding-block: dt('textarea.lg.padding.y');
        padding-inline: dt('textarea.lg.padding.x');
    }
`,classes:{root:function(e){var t=e.instance,n=e.props;return[`p-textarea p-component`,{"p-filled":t.$filled,"p-textarea-resizable ":n.autoResize,"p-textarea-sm p-inputfield-sm":n.size===`small`,"p-textarea-lg p-inputfield-lg":n.size===`large`,"p-invalid":t.$invalid,"p-variant-filled":t.$variant===`filled`,"p-textarea-fluid":t.$fluid}]}}}),m={name:`BaseTextarea`,extends:f,props:{autoResize:Boolean},style:p,provide:function(){return{$pcTextarea:this,$parentInstance:this}}};function h(e){"@babel/helpers - typeof";return h=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},h(e)}function g(e,t,n){return(t=_(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function _(e){var t=v(e,`string`);return h(t)==`symbol`?t:t+``}function v(e,t){if(h(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t);if(h(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}var y={name:`Textarea`,extends:m,inheritAttrs:!1,observer:null,mounted:function(){var e=this;this.autoResize&&(this.observer=new ResizeObserver(function(){requestAnimationFrame(function(){e.resize()})}),this.observer.observe(this.$el))},updated:function(){this.autoResize&&this.resize()},beforeUnmount:function(){this.observer&&this.observer.disconnect()},methods:{resize:function(){if(this.$el.offsetParent){var e=this.$el.style.height,t=parseInt(e)||0,n=this.$el.scrollHeight;t&&n<t?(this.$el.style.height=`auto`,this.$el.style.height=`${this.$el.scrollHeight}px`):(!t||n>t)&&(this.$el.style.height=`${n}px`)}},onInput:function(e){this.autoResize&&this.resize(),this.writeValue(e.target.value,e)}},computed:{attrs:function(){return r(this.ptmi(`root`,{context:{filled:this.$filled,disabled:this.disabled}}),this.formField)},dataP:function(){return d(g({invalid:this.$invalid,fluid:this.$fluid,filled:this.$variant===`filled`},this.size,this.size))}}},b=[`value`,`name`,`disabled`,`aria-invalid`,`data-p`];function x(e,t,n,a,o,c){return i(),s(`textarea`,r({class:e.cx(`root`),value:e.d_value,name:e.name,disabled:e.disabled,"aria-invalid":e.invalid||void 0,"data-p":c.dataP,onInput:t[0]||=function(){return c.onInput&&c.onInput.apply(c,arguments)}},c.attrs),null,16,b)}y.render=x;var S={class:`p-2`},C={key:0,class:`inline-block text-center`,"data-testid":`image-preview`},w=[`src`],T={key:1,class:`flex flex-col gap-2`},E=n({__name:`ImageUrlField`,props:{image:{},uploading:{type:Boolean}},emits:[`upload`,`remove`],setup(n,{emit:r}){let l=r,{t:d}=c(),f=o(``);function p(){let e=f.value.trim();e&&(l(`upload`,e),f.value=``)}let m=()=>setTimeout(p,0);return(r,o)=>(i(),s(`div`,S,[n.image?(i(),s(`div`,C,[t(`img`,{src:n.image.url,alt:``,class:`mb-2 max-h-64 max-w-full border border-border p-1`},null,8,w),t(`div`,null,[a(e(u),{label:e(d)(`DELETE`),severity:`danger`,size:`small`,"data-testid":`image-remove`,onClick:o[0]||=e=>l(`remove`)},null,8,[`label`])])])):(i(),s(`div`,T,[a(e(y),{modelValue:f.value,"onUpdate:modelValue":o[1]||=e=>f.value=e,rows:`3`,class:`w-full`,placeholder:e(d)(`DRAG_IMAGE_HERE`),"data-testid":`image-url`,onPaste:m},null,8,[`modelValue`,`placeholder`]),t(`div`,null,[a(e(u),{label:e(d)(`UPLOAD`),loading:n.uploading,disabled:!f.value.trim(),size:`small`,"data-testid":`image-upload`,onClick:p},null,8,[`label`,`loading`,`disabled`])])]))]))}});export{y as n,E as t};