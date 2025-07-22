import{ch as vi,ad as Co,r as f,m as W,a as Ti,cr as Oo,H as pn,_ as tr,ge as fn,p as X,am as dt,l4 as gn,T as br,bl as vn,ga as Io,c8 as Tn,jt as qi,hp as xn,hs as Ft,f7 as Bt,l5 as _n,bo as En,bq as bn,l6 as Sr,bn as Sn,l7 as wn,l8 as Mn,cc as An,b1 as kt,cW as it,aE as C,g9 as xi,hw as Ke,bs as Rn,hz as Ct,hE as Zt,x as No,b9 as yn,i4 as Cn,ey as On,f1 as In,i7 as Nn,i8 as Zr,k6 as $n,cV as _i,c7 as Pn,l9 as Dn,la as Ln,lb as $o,lc as Po,iH as ci,aT as xe,f9 as Ei,ac as Do,g4 as Fn,ej as lr,cq as Bn,kQ as Un,ld as Ut,i6 as Gn}from"./index-f00bd99f.js";import{r as zn}from"./videoUtils-7880a0f1.js";import{u as vt,O as di,e as nt,s as Ze,i as ye,a as ui,n as rr}from"./basicInterfaces-cbf2757f.js";import{_ as Nt}from"./TextureFormat-60b88abd.js";import{_ as mt,l as K,B as g,H as st,n as He,M as U,V as Vn,G as $e,X as _e,L as B,P as de,F as wr,o as Xi,U as Hn,A as se,S as Lo,I as Fo,T as hi,C as Le,e as Jr,i as Kr,r as Wn,R as jn,u as kn,D as Ee,g as qn,a as Xn}from"./enums-ff43618c.js";import{s as q,l as Yn,g as Bo,h as Zn,o as fr,m as Jn,T as Yi,f as Zi,J as Ji,p as Kn,y as Qn}from"./BufferView-920eb48c.js";import{I as Ki,v as es,c as De,r as pe,_ as bi,H as qt,s as oe,g as Pe,u as Ye,o as te,p as ts,K as rs,P as ot,E as Ce,A as Jt,j as Qi,R as at,q as Tt,N as is}from"./vec32-6757f7c3.js";import{s as ir,a as os,c as gr,E as Uo,U as ke}from"./sphere-47db6b49.js";import{v as Go,A as eo,M as as}from"./lineSegment-eb444802.js";import{c as ne}from"./vectorStacks-5954743a.js";import{I as ns,L as ss,l as mi}from"./orientedBoundingBox-b5a2f26d.js";import{O as ls}from"./InterleavedLayout-9da534c5.js";import{n as d,d as Ve,b as S,u as Je,t as $,c as j,C as Si,a as le,e as Dr,H as cs,r as to,o as Qr,f as ds}from"./NormalAttribute.glsl-c8a94bd0.js";import{e as T}from"./VertexAttribute-123db042.js";import{e as or,r as ro}from"./mat4f64-a3dc1405.js";import{M as Lr,D as us,h as hs,P as pi,U as ms,q as ps,x as fs,w as gs,z as zo,H as vs,O as Mr,y as Ts}from"./plane-d072a060.js";import{j as xs}from"./mat3-cd249fcd.js";import{e as wi,r as Ot}from"./mat3f64-d34bdb1e.js";import{a as _s,n as Fr}from"./vec2f64-44b9a02c.js";import{o as lt}from"./vec2-c0ea4c96.js";function lh(t,e=!1){return t<=vi?e?new Array(t).fill(0):new Array(t):new Float32Array(t)}function ch(t){return(Array.isArray(t)?t.length:t.byteLength/8)<=vi?Array.from(t):new Float32Array(t)}function Es(t){t.vertex.code.add(d`
    vec4 decodeSymbolColor(vec4 symbolColor, out int colorMixMode) {
      float symbolAlpha = 0.0;

      const float maxTint = 85.0;
      const float maxReplace = 170.0;
      const float scaleAlpha = 3.0;

      if (symbolColor.a > maxReplace) {
        colorMixMode = ${d.int(Ve.Multiply)};
        symbolAlpha = scaleAlpha * (symbolColor.a - maxReplace);
      } else if (symbolColor.a > maxTint) {
        colorMixMode = ${d.int(Ve.Replace)};
        symbolAlpha = scaleAlpha * (symbolColor.a - maxTint);
      } else if (symbolColor.a > 0.0) {
        colorMixMode = ${d.int(Ve.Tint)};
        symbolAlpha = scaleAlpha * symbolColor.a;
      } else {
        colorMixMode = ${d.int(Ve.Multiply)};
        symbolAlpha = 0.0;
      }

      return vec4(symbolColor.r, symbolColor.g, symbolColor.b, symbolAlpha);
    }
  `)}let k=class{constructor(e,r,i,o,a=null){if(this.name=e,this.type=r,this.arraySize=a,this.bind={[S.Bind]:null,[S.Pass]:null,[S.Draw]:null},o)switch(i){case void 0:break;case S.Bind:this.bind[S.Bind]=o;break;case S.Pass:this.bind[S.Pass]=o;break;case S.Draw:this.bind[S.Draw]=o}}equals(e){return this.type===e.type&&this.name===e.name&&this.arraySize===e.arraySize}},Kt=class extends k{constructor(e,r){super(e,"sampler2D",S.Draw,(i,o,a)=>i.bindTexture(e,r(o,a)))}};function bs(){return!!Co("enable-feature:objectAndLayerId-rendering")}let Rt=class extends k{constructor(e,r){super(e,"float",S.Bind,(i,o)=>i.setUniform1f(e,r(o)))}};function Vo({code:t,uniforms:e},r){e.add(new Rt("dpDummy",()=>1)),t.add(d`vec3 dpAdd(vec3 hiA, vec3 loA, vec3 hiB, vec3 loB) {
vec3 hiD = hiA + hiB;
vec3 loD = loA + loB;
return  dpDummy * hiD + loD;
}`)}let be=class extends k{constructor(e,r){super(e,"vec3",S.Draw,(i,o,a,n)=>i.setUniform3fv(e,r(o,a,n)))}},ae=class extends k{constructor(e,r){super(e,"vec3",S.Pass,(i,o,a)=>i.setUniform3fv(e,r(o,a)))}},Ho=class extends k{constructor(e,r){super(e,"mat3",S.Draw,(i,o,a)=>i.setUniformMatrix3fv(e,r(o,a)))}},Fe=class extends k{constructor(e,r){super(e,"mat3",S.Pass,(i,o,a)=>i.setUniformMatrix3fv(e,r(o,a)))}},vr=class extends k{constructor(e,r){super(e,"mat4",S.Bind,(i,o)=>i.setUniformMatrix4fv(e,r(o)))}},J=class extends Oo{constructor(){super(...arguments),this.SCENEVIEW_HITTEST_RETURN_INTERSECTOR=!1,this.DECONFLICTOR_SHOW_VISIBLE=!1,this.DECONFLICTOR_SHOW_INVISIBLE=!1,this.DECONFLICTOR_SHOW_GRID=!1,this.LABELS_SHOW_BORDER=!1,this.TEXT_SHOW_BASELINE=!1,this.TEXT_SHOW_BORDER=!1,this.OVERLAY_DRAW_DEBUG_TEXTURE=!1,this.OVERLAY_SHOW_CENTER=!1,this.SHOW_POI=!1,this.TESTS_DISABLE_OPTIMIZATIONS=!1,this.TESTS_DISABLE_FAST_UPDATES=!1,this.DRAW_MESH_GEOMETRY_NORMALS=!1,this.FEATURE_TILE_FETCH_SHOW_TILES=!1,this.FEATURE_TILE_TREE_SHOW_TILES=!1,this.TERRAIN_TILE_TREE_SHOW_TILES=!1,this.I3S_TREE_SHOW_TILES=!1,this.I3S_SHOW_MODIFICATIONS=!1,this.LOD_INSTANCE_RENDERER_DISABLE_UPDATES=!1,this.LOD_INSTANCE_RENDERER_COLORIZE_BY_LEVEL=!1,this.EDGES_SHOW_HIDDEN_TRANSPARENT_EDGES=!1,this.LINE_WIREFRAMES=!1}};f([W()],J.prototype,"SCENEVIEW_HITTEST_RETURN_INTERSECTOR",void 0),f([W()],J.prototype,"DECONFLICTOR_SHOW_VISIBLE",void 0),f([W()],J.prototype,"DECONFLICTOR_SHOW_INVISIBLE",void 0),f([W()],J.prototype,"DECONFLICTOR_SHOW_GRID",void 0),f([W()],J.prototype,"LABELS_SHOW_BORDER",void 0),f([W()],J.prototype,"TEXT_SHOW_BASELINE",void 0),f([W()],J.prototype,"TEXT_SHOW_BORDER",void 0),f([W()],J.prototype,"OVERLAY_DRAW_DEBUG_TEXTURE",void 0),f([W()],J.prototype,"OVERLAY_SHOW_CENTER",void 0),f([W()],J.prototype,"SHOW_POI",void 0),f([W()],J.prototype,"TESTS_DISABLE_OPTIMIZATIONS",void 0),f([W()],J.prototype,"TESTS_DISABLE_FAST_UPDATES",void 0),f([W()],J.prototype,"DRAW_MESH_GEOMETRY_NORMALS",void 0),f([W()],J.prototype,"FEATURE_TILE_FETCH_SHOW_TILES",void 0),f([W()],J.prototype,"FEATURE_TILE_TREE_SHOW_TILES",void 0),f([W()],J.prototype,"TERRAIN_TILE_TREE_SHOW_TILES",void 0),f([W()],J.prototype,"I3S_TREE_SHOW_TILES",void 0),f([W()],J.prototype,"I3S_SHOW_MODIFICATIONS",void 0),f([W()],J.prototype,"LOD_INSTANCE_RENDERER_DISABLE_UPDATES",void 0),f([W()],J.prototype,"LOD_INSTANCE_RENDERER_COLORIZE_BY_LEVEL",void 0),f([W()],J.prototype,"EDGES_SHOW_HIDDEN_TRANSPARENT_EDGES",void 0),f([W()],J.prototype,"LINE_WIREFRAMES",void 0),J=f([Ti("esri.views.3d.support.debugFlags")],J);const xh=new J;async function Ss(t,e){const{data:r}=await pn(t,{responseType:"image",...e});return r}function ws(){return io??(io=(async()=>{const t=await tr(()=>import("./basis_transcoder-fe99e870.js"),[]),e=await t.default({locateFile:r=>fn(`esri/libs/basisu/${r}`)});return e.initializeBasis(),e})()),io}let io;const Ms=()=>dt.getLogger("esri.views.webgl.checkWebGLError");function As(t){switch(t){case mt.INVALID_ENUM:return"Invalid Enum. An unacceptable value has been specified for an enumerated argument.";case mt.INVALID_VALUE:return"Invalid Value. A numeric argument is out of range.";case mt.INVALID_OPERATION:return"Invalid Operation. The specified command is not allowed for the current state.";case mt.INVALID_FRAMEBUFFER_OPERATION:return"Invalid Framebuffer operation. The currently bound framebuffer is not framebuffer complete when trying to render to or to read from it.";case mt.OUT_OF_MEMORY:return"Out of memory. Not enough memory is left to execute the command.";case mt.CONTEXT_LOST_WEBGL:return"WebGL context has been lost";default:return"Unknown error"}}const Rs=!!Co("enable-feature:webgl-debug");function Wo(){return Rs}function Qe(t,e=Wo()){if(e){const r=t.getError();if(r){const i=As(r),o=new Error().stack;Ms().error(new X("webgl-error","WebGL error occurred",{message:i,stack:o}))}}}var Ar;(function(t){t[t.TextureDescriptor=0]="TextureDescriptor",t[t.Texture=1]="Texture",t[t.Renderbuffer=2]="Renderbuffer"})(Ar||(Ar={}));function jo(t){switch(t){case U.ALPHA:case U.LUMINANCE:case U.RED:case U.RED_INTEGER:case g.R8:case g.R8I:case g.R8UI:case g.R8_SNORM:case Vn.STENCIL_INDEX8:return 1;case U.LUMINANCE_ALPHA:case U.RG:case U.RG_INTEGER:case g.RGBA4:case g.R16F:case g.R16I:case g.R16UI:case g.RG8:case g.RG8I:case g.RG8UI:case g.RG8_SNORM:case g.RGB565:case g.RGB5_A1:case He.DEPTH_COMPONENT16:return 2;case U.RGB:case U.RGB_INTEGER:case g.RGB8:case g.RGB8I:case g.RGB8UI:case g.RGB8_SNORM:case g.SRGB8:case He.DEPTH_COMPONENT24:return 3;case U.RGBA:case U.RGBA_INTEGER:case g.RGBA8:case g.R32F:case g.R11F_G11F_B10F:case g.RG16F:case g.R32I:case g.R32UI:case g.RG16I:case g.RG16UI:case g.RGBA8I:case g.RGBA8UI:case g.RGBA8_SNORM:case g.SRGB8_ALPHA8:case g.RGB9_E5:case g.RGB10_A2UI:case g.RGB10_A2:case He.DEPTH_COMPONENT32F:case st.DEPTH24_STENCIL8:return 4;case st.DEPTH32F_STENCIL8:return 5;case g.RGB16F:case g.RGB16I:case g.RGB16UI:return 6;case g.RG32F:case g.RG32I:case g.RG32UI:case g.RGBA16F:case g.RGBA16I:case g.RGBA16UI:return 8;case g.RGB32F:case g.RGB32I:case g.RGB32UI:return 12;case g.RGBA32F:case g.RGBA32I:case g.RGBA32UI:return 16;case K.COMPRESSED_RGB_S3TC_DXT1_EXT:case K.COMPRESSED_RGBA_S3TC_DXT1_EXT:return .5;case K.COMPRESSED_RGBA_S3TC_DXT3_EXT:case K.COMPRESSED_RGBA_S3TC_DXT5_EXT:return 1;case K.COMPRESSED_R11_EAC:case K.COMPRESSED_SIGNED_R11_EAC:case K.COMPRESSED_RGB8_ETC2:case K.COMPRESSED_SRGB8_ETC2:case K.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2:case K.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2:return .5;case K.COMPRESSED_RG11_EAC:case K.COMPRESSED_SIGNED_RG11_EAC:case K.COMPRESSED_RGBA8_ETC2_EAC:case K.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:return 1}return 0}let ge=class{constructor(e=0,r=e){this.width=e,this.height=r,this.type=Ar.TextureDescriptor,this.target=$e.TEXTURE_2D,this.pixelFormat=U.RGBA,this.dataType=_e.UNSIGNED_BYTE,this.samplingMode=B.LINEAR,this.wrapMode=de.REPEAT,this.maxAnisotropy=1,this.flipped=!1,this.hasMipmap=!1,this.isOpaque=!1,this.unpackAlignment=4,this.preMultiplyAlpha=!1,this.compareEnabled=!1,this.linearFilterDepth=!1,this.depth=1,this.isImmutable=!1}};function ys(t){return t.width<=0||t.height<=0||t.depth<=0?0:Math.round(t.width*t.height*t.depth*(t.hasMipmap?4/3:1)*(t.internalFormat==null?4:jo(t.internalFormat))*(t.target===$e.TEXTURE_CUBE_MAP?6:1))}const $t=()=>dt.getLogger("esri/views/webgl/textureUtils");function Pt(t){const{width:e,height:r,depth:i}=t;(e!=null&&e<0||r!=null&&r<0||i!=null&&i<0)&&$t().error("Negative dimension parameters are not allowed!");const{internalFormat:o}=t;if(o&&(Mi(o)||ko(o))){const{linearFilterDepth:a,compareEnabled:n,samplingMode:s,hasMipmap:l}=t;l&&$t().error("Depth textures cannot have mipmaps"),a?s!==B.LINEAR&&s!==B.NEAREST&&$t().error("Depth textures cannot sample mipmaps"):(s!==B.NEAREST&&$t().error("Depth textures without filtering must use NEAREST filtering"),n&&$t().error("Depth textures without filtering cannot use compare function"))}}function Cs(t){return t in g}function Mi(t){return t in He}function ko(t){return t in st}function Os(t){return t!=null&&t in K}function gt(t){return t!=null&&"type"in t&&t.type==="compressed"}function Is(t){return t!=null&&"byteLength"in t}function oo(t){return t!=null&&!gt(t)&&!Is(t)}function pt(t){return t===$e.TEXTURE_3D||t===$e.TEXTURE_2D_ARRAY}function ao(t,e,r,i=1){let o=Math.max(e,r);return t===$e.TEXTURE_3D&&(o=Math.max(o,i)),Math.floor(Math.log2(o))+1}function cr(t){if(t.internalFormat!=null)return t.internalFormat;switch(t.dataType){case _e.FLOAT:switch(t.pixelFormat){case U.RGBA:return g.RGBA32F;case U.RGB:return g.RGB32F;default:throw new X("texture:unknown-format","Unable to derive format")}case _e.UNSIGNED_BYTE:switch(t.pixelFormat){case U.RGBA:return g.RGBA8;case U.RGB:return g.RGB8}}const{pixelFormat:e}=t;return t.internalFormat=e===wr.DEPTH_STENCIL?st.DEPTH24_STENCIL8:e===wr.DEPTH_COMPONENT?He.DEPTH_COMPONENT24:e,t.internalFormat}function Ns(t){let e="width"in t?t.width:t.codedWidth,r="height"in t?t.height:t.codedHeight;const i=1;return t instanceof HTMLVideoElement&&(e=t.videoWidth,r=t.videoHeight),{width:e,height:r,depth:i}}let $s=class qo extends ge{constructor(e,r){switch(super(),this.context=e,Object.assign(this,r),this.internalFormat){case g.R16F:case g.R32F:case g.R8_SNORM:case g.R8:this.pixelFormat=U.RED;break;case g.R8I:case g.R8UI:case g.R16I:case g.R16UI:case g.R32I:case g.R32UI:this.pixelFormat=U.RED_INTEGER}}static validate(e,r){return new qo(e,r)}};const Ge=()=>dt.getLogger("esri/views/webgl/Texture");var re;let At=(re=class{constructor(e,r=null,i=null){if(this.type=Ar.Texture,this._glName=null,this._samplingModeDirty=!1,this._wrapModeDirty=!1,this._shadowFilterDirty=!1,this._wasImmutablyAllocated=!1,"context"in e)this._descriptor=e,i=r;else{const o=$s.validate(e,r);if(!o)throw new X("texture:invalid-descriptor","Texture descriptor invalid");this._descriptor=o}this._descriptor.target===$e.TEXTURE_CUBE_MAP?this._setDataCubeMap(i):this.setData(i)}get glName(){return this._glName}get descriptor(){return this._descriptor}get usedMemory(){return ys(this._descriptor)}get cachedMemory(){return this.usedMemory}get isDirty(){return this._samplingModeDirty||this._wrapModeDirty||this._shadowFilterDirty}get hasWebGLTextureObject(){return!!this._glName}dispose(){this.abortCompression(),this._descriptor.context.gl&&this.hasWebGLTextureObject&&(this._descriptor.context.instanceCounter.decrement(Xi.Texture,this),this._descriptor.context.unbindTexture(this),this._descriptor.context.gl.deleteTexture(this._glName),this._glName=null)}release(){this.dispose()}resize(e,r){const i=this._descriptor;if(i.width!==e||i.height!==r){if(this._wasImmutablyAllocated)throw new X("texture:immutable-resize","Immutable textures can't be resized!");i.width=e,i.height=r,this._descriptor.target===$e.TEXTURE_CUBE_MAP?this._setDataCubeMap(null):this.setData(null)}}enableCompression(e){this._descriptor.compress=e}disableCompression(){this._descriptor.compress=void 0}setData(e){this.abortCompression(),!gt(e)&&this._descriptor.internalFormat&&this._descriptor.internalFormat in K&&(this._descriptor.internalFormat=void 0),this._setData(e),!gt(e)&&this._descriptor.compress&&this._compressOnWorker(e)}updateData(e,r,i,o,a,n,s=0){n||Ge().error("An attempt to use uninitialized data!"),this.hasWebGLTextureObject||Ge().error("An attempt to update uninitialized texture!");const l=this._descriptor;l.internalFormat=cr(l);const{context:c,pixelFormat:u,dataType:h,target:m,isImmutable:p}=l;if(p&&!this._wasImmutablyAllocated)throw new X("texture:uninitialized","Cannot update immutable texture before allocation!");const v=c.bindTexture(this,re.TEXTURE_UNIT_FOR_UPDATES,!0);(r<0||i<0||r+o>l.width||i+a>l.height)&&Ge().error("An attempt to update out of bounds of the texture!"),this._configurePixelStorage();const{gl:x}=c;s&&(o&&a||Ge().warn("Must pass width and height if `UNPACK_SKIP_ROWS` is used"),x.pixelStorei(x.UNPACK_SKIP_ROWS,s)),oo(n)?x.texSubImage2D(m,e,r,i,o,a,u,h,n):gt(n)?x.compressedTexSubImage2D(m,e,r,i,o,a,l.internalFormat,n.levels[e]):x.texSubImage2D(m,e,r,i,o,a,u,h,n),s&&x.pixelStorei(x.UNPACK_SKIP_ROWS,0),c.bindTexture(v,re.TEXTURE_UNIT_FOR_UPDATES)}updateData3D(e,r,i,o,a,n,s,l){l||Ge().error("An attempt to use uninitialized data!"),this.hasWebGLTextureObject||Ge().error("An attempt to update an uninitialized texture!");const c=this._descriptor;c.internalFormat=cr(c);const{context:u,pixelFormat:h,dataType:m,isImmutable:p,target:v}=c;if(p&&!this._wasImmutablyAllocated)throw new X("texture:uninitialized","Cannot update immutable texture before allocation!");pt(v)||Ge().warn("Attempting to set 3D texture data on a non-3D texture");const x=u.bindTexture(this,re.TEXTURE_UNIT_FOR_UPDATES);u.setActiveTexture(re.TEXTURE_UNIT_FOR_UPDATES),(r<0||i<0||o<0||r+a>c.width||i+n>c.height||o+s>c.depth)&&Ge().error("An attempt to update out of bounds of the texture!"),this._configurePixelStorage();const{gl:_}=u;if(gt(l))l=l.levels[e],_.compressedTexSubImage3D(v,e,r,i,o,a,n,s,c.internalFormat,l);else{const A=l;_.texSubImage3D(v,e,r,i,o,a,n,s,h,m,A)}u.bindTexture(x,re.TEXTURE_UNIT_FOR_UPDATES)}generateMipmap(){const e=this._descriptor;if(e.width===0||e.height===0)return;if(!e.hasMipmap){if(this._wasImmutablyAllocated)throw new X("texture:immutable-change","Cannot add mipmaps to immutable texture after allocation");e.hasMipmap=!0,this._samplingModeDirty=!0,Pt(e)}e.samplingMode===B.LINEAR?(this._samplingModeDirty=!0,e.samplingMode=B.LINEAR_MIPMAP_NEAREST):e.samplingMode===B.NEAREST&&(this._samplingModeDirty=!0,e.samplingMode=B.NEAREST_MIPMAP_NEAREST);const r=this._descriptor.context.bindTexture(this,re.TEXTURE_UNIT_FOR_UPDATES);this._descriptor.context.setActiveTexture(re.TEXTURE_UNIT_FOR_UPDATES),this._descriptor.context.gl.generateMipmap(e.target),this._descriptor.context.bindTexture(r,re.TEXTURE_UNIT_FOR_UPDATES)}clearMipmap(){const e=this._descriptor;if(e.hasMipmap){if(this._wasImmutablyAllocated)throw new X("texture:immutable-change","Cannot delete mipmaps to immutable texture after allocation");e.hasMipmap=!1,this._samplingModeDirty=!0,Pt(e)}e.samplingMode===B.LINEAR_MIPMAP_NEAREST?(this._samplingModeDirty=!0,e.samplingMode=B.LINEAR):e.samplingMode===B.NEAREST_MIPMAP_NEAREST&&(this._samplingModeDirty=!0,e.samplingMode=B.NEAREST)}setSamplingMode(e){e!==this._descriptor.samplingMode&&(this._descriptor.samplingMode=e,this._samplingModeDirty=!0)}setWrapMode(e){e!==this._descriptor.wrapMode&&(this._descriptor.wrapMode=e,Pt(this._descriptor),this._wrapModeDirty=!0)}setShadowFiltering(e){e!==this._descriptor.linearFilterDepth&&(this._descriptor.linearFilterDepth=this._descriptor.compareEnabled=e,this.setSamplingMode(e?B.LINEAR:B.NEAREST),Pt(this._descriptor),this._shadowFilterDirty=!0)}applyChanges(){this._samplingModeDirty&&(this._applySamplingMode(),this._samplingModeDirty=!1),this._wrapModeDirty&&(this._applyWrapMode(),this._wrapModeDirty=!1),this._shadowFilterDirty&&(this._applyShadowMode(),this._shadowFilterDirty=!1)}abortCompression(){this._compressionAbortController=gn(this._compressionAbortController)}_setData(e,r){const i=this._descriptor,o=i.context?.gl;if(!o)return;Qe(o),this.hasWebGLTextureObject||(this._glName=o.createTexture(),i.context.instanceCounter.increment(Xi.Texture,this)),Pt(i);const a=i.context.bindTexture(this,re.TEXTURE_UNIT_FOR_UPDATES);i.context.setActiveTexture(re.TEXTURE_UNIT_FOR_UPDATES),this._configurePixelStorage(),Qe(o);const n=r??i.target,s=pt(n);if(oo(e))this._setDataFromTexImageSource(e,n);else{const{width:l,height:c,depth:u}=i;if(l==null||c==null)throw new X("texture:missing-size","Width and height must be specified!");if(s&&u==null)throw new X("texture:missing-depth","Depth must be specified!");if(i.internalFormat=cr(i),i.isImmutable&&!this._wasImmutablyAllocated&&this._texStorage(n,i.internalFormat,i.hasMipmap,l,c,u),gt(e)){if(!Os(i.internalFormat))throw new X("texture:format-mismatch","Attempting to use compressed data with an uncompressed format!");this._setDataFromCompressedSource(e,i.internalFormat,n)}else this._texImage(n,0,i.internalFormat,l,c,u,e),Qe(o),i.hasMipmap&&this.generateMipmap()}this._applySamplingMode(),this._applyWrapMode(),this._applyAnisotropicFilteringParameters(),this._applyShadowMode(),Qe(o),i.context.bindTexture(a,re.TEXTURE_UNIT_FOR_UPDATES)}_setDataCubeMap(e=null){for(let r=$e.TEXTURE_CUBE_MAP_POSITIVE_X;r<=$e.TEXTURE_CUBE_MAP_NEGATIVE_Z;r++)this._setData(e,r)}_configurePixelStorage(){const e=this._descriptor.context.gl,{unpackAlignment:r,flipped:i,preMultiplyAlpha:o}=this._descriptor;e.pixelStorei(e.UNPACK_ALIGNMENT,r),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,i?1:0),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o?1:0)}_setDataFromTexImageSource(e,r){const{gl:i}=this._descriptor.context,o=this._descriptor;o.internalFormat=cr(o);const a=pt(r),{width:n,height:s,depth:l}=Ns(e);o.width&&o.height,o.width||(o.width=n),o.height||(o.height=s),a&&o.depth,a&&(o.depth=l),o.isImmutable&&!this._wasImmutablyAllocated&&this._texStorage(r,o.internalFormat,o.hasMipmap,n,s,l),this._texImage(r,0,o.internalFormat,n,s,l,e),Qe(i),o.hasMipmap&&(this.generateMipmap(),Qe(i))}_setDataFromCompressedSource(e,r,i){const o=this._descriptor,{width:a,height:n,depth:s}=o,l=e.levels,c=ao(i,a,n,s),u=Math.min(c,l.length)-1;this._descriptor.context.gl.texParameteri(o.target,Hn.MAX_LEVEL,u),this._forEachMipmapLevel((h,m,p,v)=>{const x=l[Math.min(h,l.length-1)];this._compressedTexImage(i,h,r,m,p,v,x)},u)}_texStorage(e,r,i,o,a,n){const{gl:s}=this._descriptor.context;if(!Cs(r)&&!Mi(r)&&!ko(r))throw new X("texture:missing-format","Immutable textures must have a sized internal format");if(!this._descriptor.isImmutable)return;const l=i?ao(e,o,a,n):1;if(pt(e)){if(n==null)throw new X("texture:missing-depth","Missing depth dimension for 3D texture upload");s.texStorage3D(e,l,r,o,a,n)}else s.texStorage2D(e,l,r,o,a);this._wasImmutablyAllocated=!0}_texImage(e,r,i,o,a,n,s){const l=this._descriptor.context.gl,c=pt(e),{isImmutable:u,pixelFormat:h,dataType:m}=this._descriptor;if(u){if(s!=null){const p=s;if(c){if(n==null)throw new X("texture:missing-depth","Missing depth dimension for 3D texture upload");l.texSubImage3D(e,r,0,0,0,o,a,n,h,m,p)}else l.texSubImage2D(e,r,0,0,o,a,h,m,p)}}else{const p=s;if(c){if(n==null)throw new X("texture:missing-depth","Missing depth dimension for 3D texture upload");l.texImage3D(e,r,i,o,a,n,0,h,m,p)}else l.texImage2D(e,r,i,o,a,0,h,m,p)}}_compressedTexImage(e,r,i,o,a,n,s){const l=this._descriptor.context.gl,c=pt(e);if(this._descriptor.isImmutable){if(s!=null)if(c){if(n==null)throw new X("texture:missing-depth","Missing depth dimension for 3D texture upload");l.compressedTexSubImage3D(e,r,0,0,0,o,a,n,i,s)}else l.compressedTexSubImage2D(e,r,0,0,o,a,i,s)}else if(c){if(n==null)throw new X("texture:missing-depth","Missing depth dimension for 3D texture upload");l.compressedTexImage3D(e,r,i,o,a,n,0,s)}else l.compressedTexImage2D(e,r,i,o,a,0,s)}async _compressOnWorker(e){const{width:r,height:i,context:o,flipped:a,preMultiplyAlpha:n,hasMipmap:s}=this._descriptor,l=this._descriptor.compress?.compressionTracker,c=this._descriptor.compress?.compressionCallback,{compressedTextureETC:u,compressedTextureS3TC:h}=o.capabilities;if(!re.compressionWorkerHandle?.isCompressible(e,this._descriptor)||!u&&!h)return;this.abortCompression();const m=new AbortController;this._compressionAbortController=m,l?.increment();try{let p;e instanceof Uint8Array?p=e.buffer:(p=await createImageBitmap(e,{imageOrientation:a?"flipY":"none"}),br(m));const v={data:p,width:r,height:i,needsFlip:e instanceof Uint8Array&&this.descriptor.flipped,components:this._descriptor.pixelFormat===U.RGBA?4:3,preMultiplyAlpha:n,hasMipmap:s,hasETC:!!u,hasS3TC:!!h},x=await re.compressionWorkerHandle.invoke(v,m.signal,"low");if(br(m),x.compressedTexture&&this.hasWebGLTextureObject){const _=this.usedMemory;this._descriptor.internalFormat=x.internalFormat,this._setData(x.compressedTexture),c?.(_-this.usedMemory)}}catch(p){vn(p)||Ge().error("Texture compression failed!")}finally{l?.decrement(),this._compressionAbortController?.signal.aborted&&(this._compressionAbortController=null)}}_forEachMipmapLevel(e,r=1/0){let{width:i,height:o,depth:a,hasMipmap:n,target:s}=this._descriptor;const l=s===$e.TEXTURE_3D;if(i==null||o==null||l&&a==null)throw new X("texture:missing-size","Missing texture dimensions for mipmap calculation");for(let c=0;e(c,i,o,a),n&&(i!==1||o!==1||l&&a!==1)&&!(c>=r);++c)i=Math.max(1,i>>1),o=Math.max(1,o>>1),l&&(a=Math.max(1,a>>1))}_applySamplingMode(){const e=this._descriptor,r=e.context?.gl;let i=e.samplingMode,o=e.samplingMode;i===B.LINEAR_MIPMAP_NEAREST||i===B.LINEAR_MIPMAP_LINEAR?(i=B.LINEAR,e.hasMipmap||(o=B.LINEAR)):i!==B.NEAREST_MIPMAP_NEAREST&&i!==B.NEAREST_MIPMAP_LINEAR||(i=B.NEAREST,e.hasMipmap||(o=B.NEAREST)),r.texParameteri(e.target,r.TEXTURE_MAG_FILTER,i),r.texParameteri(e.target,r.TEXTURE_MIN_FILTER,o)}_applyWrapMode(){const e=this._descriptor,r=e.context?.gl;typeof e.wrapMode=="number"?(r.texParameteri(e.target,r.TEXTURE_WRAP_S,e.wrapMode),r.texParameteri(e.target,r.TEXTURE_WRAP_T,e.wrapMode)):(r.texParameteri(e.target,r.TEXTURE_WRAP_S,e.wrapMode.s),r.texParameteri(e.target,r.TEXTURE_WRAP_T,e.wrapMode.t))}_applyShadowMode(){const e=this._descriptor,r=e.context?.gl,i=e.compareEnabled?r.COMPARE_REF_TO_TEXTURE:r.NONE;r.texParameteri(e.target,r.TEXTURE_COMPARE_MODE,i),e.compareEnabled&&r.texParameteri(e.target,r.TEXTURE_COMPARE_FUNC,r.GREATER),Qe(r)}_applyAnisotropicFilteringParameters(){const e=this._descriptor,r=e.context.capabilities.textureFilterAnisotropic;r&&e.context.gl.texParameterf(e.target,r.TEXTURE_MAX_ANISOTROPY,e.maxAnisotropy??1)}},re.TEXTURE_UNIT_FOR_UPDATES=0,re.compressionWorkerHandle=null,re),Oe=null,dr=null;async function Xo(){return dr==null&&(dr=ws(),Oe=await dr),dr}function Ps(t,e){if(Oe==null)return t.byteLength;const r=new Oe.BasisFile(new Uint8Array(t)),i=Zo(r)?Yo(r.getNumLevels(0),r.getHasAlpha(),r.getImageWidth(0,0),r.getImageHeight(0,0),e):0;return r.close(),r.delete(),i}function Ds(t,e){if(Oe==null)return t.byteLength;const r=new Oe.KTX2File(new Uint8Array(t)),i=Jo(r)?Yo(r.getLevels(),r.getHasAlpha(),r.getWidth(),r.getHeight(),e):0;return r.close(),r.delete(),i}function Yo(t,e,r,i,o){const a=jo(e?K.COMPRESSED_RGBA8_ETC2_EAC:K.COMPRESSED_RGB8_ETC2),n=o&&t>1?(4**t-1)/(3*4**(t-1)):1;return Math.ceil(r*i*a*n)}function Zo(t){return t.getNumImages()>=1&&!t.isUASTC()}function Jo(t){return t.getFaces()>=1&&t.isETC1S()}async function Ls(t,e,r){Oe==null&&(Oe=await Xo());const i=new Oe.BasisFile(new Uint8Array(r));if(!Zo(i))return null;i.startTranscoding();const o=Ko(t,e,i.getNumLevels(0),i.getHasAlpha(),i.getImageWidth(0,0),i.getImageHeight(0,0),(a,n)=>i.getImageTranscodedSizeInBytes(0,a,n),(a,n,s)=>i.transcodeImage(s,0,a,n,0,0));return i.close(),i.delete(),o}async function Fs(t,e,r){Oe==null&&(Oe=await Xo());const i=new Oe.KTX2File(new Uint8Array(r));if(!Jo(i))return null;i.startTranscoding();const o=Ko(t,e,i.getLevels(),i.getHasAlpha(),i.getWidth(),i.getHeight(),(a,n)=>i.getImageTranscodedSizeInBytes(a,0,0,n),(a,n,s)=>i.transcodeImage(s,a,0,0,n,0,-1,-1));return i.close(),i.delete(),o}function Ko(t,e,r,i,o,a,n,s){const{compressedTextureETC:l,compressedTextureS3TC:c}=t.capabilities,[u,h]=l?i?[Nt.ETC2_RGBA,K.COMPRESSED_RGBA8_ETC2_EAC]:[Nt.ETC1_RGB,K.COMPRESSED_RGB8_ETC2]:c?i?[Nt.BC3_RGBA,K.COMPRESSED_RGBA_S3TC_DXT5_EXT]:[Nt.BC1_RGB,K.COMPRESSED_RGB_S3TC_DXT1_EXT]:[Nt.RGBA32,U.RGBA],m=e.hasMipmap?r:Math.min(1,r),p=[];for(let v=0;v<m;v++)p.push(new Uint8Array(n(v,u))),s(v,u,p[v]);return e.internalFormat=h,e.hasMipmap=p.length>1,e.samplingMode=e.hasMipmap?B.LINEAR_MIPMAP_LINEAR:B.LINEAR,e.width=o,e.height=a,new At(t,e,{type:"compressed",levels:p})}const ur=()=>dt.getLogger("esri.views.3d.webgl-engine.lib.DDSUtil"),Bs=542327876,Us=131072,Gs=4;function Ai(t){return t.charCodeAt(0)+(t.charCodeAt(1)<<8)+(t.charCodeAt(2)<<16)+(t.charCodeAt(3)<<24)}function zs(t){return String.fromCharCode(255&t,t>>8&255,t>>16&255,t>>24&255)}const Vs=Ai("DXT1"),Hs=Ai("DXT3"),Ws=Ai("DXT5"),js=31,ks=0,qs=1,Xs=2,Ys=3,Zs=4,Js=7,Ks=20,Qs=21;function el(t,e,r){const i=tl(r,e.hasMipmap??!1);if(i==null)throw new Error("DDS texture data is null");const{textureData:o,internalFormat:a,width:n,height:s}=i;return e.samplingMode=o.levels.length>1?B.LINEAR_MIPMAP_LINEAR:B.LINEAR,e.hasMipmap=o.levels.length>1,e.internalFormat=a,e.width=n,e.height=s,new At(t,e,o)}function tl(t,e){const r=new Int32Array(t.buffer,t.byteOffset,js);if(r[ks]!==Bs)return ur().error("Invalid magic number in DDS header"),null;if(!(r[Ks]&Gs))return ur().error("Unsupported format, must contain a FourCC code"),null;const i=r[Qs];let o,a;switch(i){case Vs:o=8,a=K.COMPRESSED_RGB_S3TC_DXT1_EXT;break;case Hs:o=16,a=K.COMPRESSED_RGBA_S3TC_DXT3_EXT;break;case Ws:o=16,a=K.COMPRESSED_RGBA_S3TC_DXT5_EXT;break;default:return ur().error("Unsupported FourCC code:",zs(i)),null}let n=1,s=r[Zs],l=r[Ys];(3&s||3&l)&&(ur().warn("Rounding up compressed texture size to nearest multiple of 4."),s=s+3&-4,l=l+3&-4);const c=s,u=l;let h,m;r[Xs]&Us&&e!==!1&&(n=Math.max(1,r[Js]));let p=t.byteOffset+r[qs]+4;const v=[];for(let x=0;x<n;++x)m=(s+3>>2)*(l+3>>2)*o,h=new Uint8Array(t.buffer,p,m),v.push(h),p+=m,s=Math.max(1,s>>1),l=Math.max(1,l>>1);return{textureData:{type:"compressed",levels:v},internalFormat:a,width:c,height:u}}const hr=16;function no(t,e){return e=Math.floor(e/hr)*hr,Math.min(Math.round(t/hr)*hr,e)}function rl(t,e){const[r,i]=il(t,e);return t.width===r&&t.height===i?t:Qo(t,r,i)}function il({width:t,height:e},{maxPreferredTexturePixels:r,maxTextureSize:i}){const o=Math.max(t,e),a=t*e;if(o<=i&&a<=r)return[t,e];const n=Math.min(Math.sqrt(r/a),i/o);return[no(Math.round(t*n),i),no(Math.round(e*n),i)]}function Qo(t,e,r){if(t instanceof ImageData)return Qo(ol(t),e,r);const i=document.createElement("canvas");return i.width=e,i.height=r,i.getContext("2d").drawImage(t,0,0,i.width,i.height),i}function ol(t){const e=document.createElement("canvas");e.width=t.width,e.height=t.height;const r=e.getContext("2d");if(r==null)throw new X("texture:context-failed","Failed to create 2d context from HTMLCanvasElement");return r.putImageData(t,0,0),e}let Eh=class{constructor(e,r){this._data=e,this.id=Io(),this.events=new Tn,this._parameters={...nl,...r},this._startPreload(e)}dispose(){this.unload(),this._data=this.update=void 0}_startPreload(e){e instanceof HTMLVideoElement?(this.update=r=>this._update(e,r),this._startPreloadVideoElement(e)):e instanceof HTMLImageElement&&this._startPreloadImageElement(e)}_startPreloadVideoElement(e){if(!(qi(e.src)||e.preload==="auto"&&e.crossOrigin)&&(e.preload="auto",e.crossOrigin="anonymous",e.src=e.src,e.paused&&e.autoplay)){const r=[];zn(e,i=>r.push(i)).then(()=>{e.play()}).finally(()=>r.forEach(i=>i.remove()))}}_startPreloadImageElement(e){xn(e.src)||qi(e.src)||e.crossOrigin||(e.crossOrigin="anonymous",e.src=e.src)}_createDescriptor(e){const r=new ge;return r.wrapMode=this._parameters.wrap??de.REPEAT,r.flipped=!this._parameters.noUnpackFlip,r.samplingMode=this._parameters.mipmap?B.LINEAR_MIPMAP_LINEAR:B.LINEAR,r.hasMipmap=!!this._parameters.mipmap,r.preMultiplyAlpha=!!this._parameters.preMultiplyAlpha,r.maxAnisotropy=this._parameters.maxAnisotropy??(this._parameters.mipmap?e.parameters.maxMaxAnisotropy:1),r}get glTexture(){return this._glTexture??this._emptyTexture}get loaded(){return this._glTexture!=null}get usedMemory(){return this._glTexture?.usedMemory||al(this._data,this._parameters)}load(e){if(this._loadingPromise)return this._loadingPromise;if(this._glTexture)return this._glTexture;const r=this._data;return r==null?(this._glTexture=new At(e,this._createDescriptor(e),null),this._glTexture):(this._emptyTexture=e.emptyTexture,this._parameters.reloadable||(this._data=void 0),typeof r=="string"?this._loadFromURL(e,r):r instanceof Image?this._loadFromImageElement(e,r):r instanceof HTMLVideoElement?this._loadFromVideoElement(e,r):r instanceof ImageData||r instanceof HTMLCanvasElement?this._loadFromImage(e,r):Ft(r)&&this._parameters.encoding===vt.DDS_ENCODING?this._loadFromDDSData(e,r):Bt(r)&&this._parameters.encoding===vt.DDS_ENCODING?this._loadFromDDSData(e,new Uint8Array(r)):(Bt(r)||Ft(r))&&this._parameters.encoding===vt.KTX2_ENCODING?this._loadFromKTX2(e,r):(Bt(r)||Ft(r))&&this._parameters.encoding===vt.BASIS_ENCODING?this._loadFromBasis(e,r):Ft(r)?this._loadFromPixelData(e,r):Bt(r)?this._loadFromPixelData(e,new Uint8Array(r)):null)}_update(e,r){return this._glTexture==null||e.readyState<HTMLMediaElement.HAVE_CURRENT_DATA||r===e.currentTime?r:(this._glTexture.setData(e),this._glTexture.descriptor.hasMipmap&&this._glTexture.generateMipmap(),this._parameters.updateCallback&&this._parameters.updateCallback(),e.currentTime)}_loadFromDDSData(e,r){return this._glTexture=el(e,this._createDescriptor(e),r),this._emptyTexture=null,this._glTexture}_loadFromKTX2(e,r){return this._loadAsync(()=>Fs(e,this._createDescriptor(e),r).then(i=>(this._glTexture=i,i)))}_loadFromBasis(e,r){return this._loadAsync(()=>Ls(e,this._createDescriptor(e),r).then(i=>(this._glTexture=i,i)))}_loadFromPixelData(e,r){q(this._parameters.width>0&&this._parameters.height>0);const i=this._createDescriptor(e);return i.pixelFormat=this._parameters.components===1?U.LUMINANCE:this._parameters.components===3?U.RGB:U.RGBA,i.pixelFormat!==U.RGB&&i.pixelFormat!==U.RGBA||(i.compress=this._parameters.compressionOptions),i.width=this._parameters.width??0,i.height=this._parameters.height??0,this._glTexture=new At(e,i,r),this._glTexture}_loadFromURL(e,r){return this._loadAsync(async i=>{const o=await Ss(r,{signal:i});return br(i),this._loadFromImage(e,o)})}_loadFromImageElement(e,r){return r.complete?this._loadFromImage(e,r):this._loadAsync(async i=>{const o=await _n(r,r.src,!1,i);return br(i),this._loadFromImage(e,o)})}_loadFromVideoElement(e,r){return r.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA?this._loadFromImage(e,r):this._loadFromVideoElementAsync(e,r)}_loadFromVideoElementAsync(e,r){return this._loadAsync(i=>new Promise((o,a)=>{const n=()=>{r.removeEventListener("loadeddata",s),r.removeEventListener("error",l),Sn(c)},s=()=>{r.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA&&(n(),o(this._loadFromImage(e,r)))},l=u=>{n(),a(u||new X("texture:load-error","Failed to load video"))};r.addEventListener("loadeddata",s),r.addEventListener("error",l);const c=En(i,()=>l(bn()))}))}_loadFromImage(e,r){let i=r;i instanceof HTMLVideoElement||(i=rl(i,e.parameters));const o=ea(i);this._parameters.width=o.width,this._parameters.height=o.height;const a=this._createDescriptor(e);return a.pixelFormat=this._parameters.components===3?U.RGB:U.RGBA,a.width=o.width,a.height=o.height,a.compress=this._parameters.compressionOptions,this._glTexture=new At(e,a,i),this._emptyTexture=null,this.events.emit("loaded"),this._glTexture}_loadAsync(e){const r=new AbortController;this._loadingController=r;const i=e(r.signal);this._loadingPromise=i;const o=()=>{this._loadingController===r&&(this._loadingController=null),this._loadingPromise===i&&(this._loadingPromise=null),this._emptyTexture=null};return i.then(o,o),i}unload(){if(this._glTexture=Sr(this._glTexture),this._emptyTexture=null,this._loadingController!=null){const e=this._loadingController;this._loadingController=null,this._loadingPromise=null,e.abort()}this.events.emit("unloaded")}get parameters(){return this._parameters}};function al(t,e){if(t==null)return 0;if(Bt(t)||Ft(t))return e.encoding===vt.KTX2_ENCODING?Ds(t,!!e.mipmap):e.encoding===vt.BASIS_ENCODING?Ps(t,!!e.mipmap):t.byteLength;const{width:r,height:i}=t instanceof Image||t instanceof ImageData||t instanceof HTMLCanvasElement||t instanceof HTMLVideoElement?ea(t):e;return(e.mipmap?4/3:1)*r*i*(e.components||4)||0}function ea(t){return t instanceof HTMLVideoElement?{width:t.videoWidth,height:t.videoHeight}:t}const nl={wrap:{s:de.REPEAT,t:de.REPEAT},mipmap:!0,noUnpackFlip:!1,preMultiplyAlpha:!1};function Sh(t){if(t.length<vi)return Array.from(t);if(Array.isArray(t))return Float64Array.from(t);if(!("BYTES_PER_ELEMENT"in t))return Array.from(t);switch(t.BYTES_PER_ELEMENT){case 1:return Uint8Array.from(t);case 2:return wn(t)?Yn().from(t):Mn(t)?Uint16Array.from(t):Int16Array.from(t);case 4:return Float32Array.from(t);default:return Float64Array.from(t)}}let wh=class ta{constructor(e,r,i){this.primitiveIndices=e,this._numIndexPerPrimitive=r,this.position=i,this._children=void 0,q(e.length>=1),q(i.size===3||i.size===4);const{data:o,size:a,indices:n}=i;q(n.length%this._numIndexPerPrimitive===0),q(n.length>=e.length*this._numIndexPerPrimitive);const s=e.length;let l=a*n[this._numIndexPerPrimitive*e[0]];et.clear(),et.push(l);const c=kt(o[l],o[l+1],o[l+2]),u=it(c);for(let p=0;p<s;++p){const v=this._numIndexPerPrimitive*e[p];for(let x=0;x<this._numIndexPerPrimitive;++x){l=a*n[v+x],et.push(l);let _=o[l];c[0]=Math.min(_,c[0]),u[0]=Math.max(_,u[0]),_=o[l+1],c[1]=Math.min(_,c[1]),u[1]=Math.max(_,u[1]),_=o[l+2],c[2]=Math.min(_,c[2]),u[2]=Math.max(_,u[2])}}this.bbMin=c,this.bbMax=u;const h=Ki(C(),this.bbMin,this.bbMax,.5);this.radius=.5*Math.max(Math.max(u[0]-c[0],u[1]-c[1]),u[2]-c[2]);let m=this.radius*this.radius;for(let p=0;p<et.length;++p){l=et.at(p);const v=o[l]-h[0],x=o[l+1]-h[1],_=o[l+2]-h[2],A=v*v+x*x+_*_;if(A<=m)continue;const P=Math.sqrt(A),F=.5*(P-this.radius);this.radius=this.radius+F,m=this.radius*this.radius;const D=F/P;h[0]+=v*D,h[1]+=x*D,h[2]+=_*D}this.center=h,et.clear()}getChildren(){if(this._children||es(this.bbMin,this.bbMax)<=1)return this._children;const e=Ki(C(),this.bbMin,this.bbMax,.5),r=this.primitiveIndices.length,i=new Uint8Array(r),o=new Array(8);for(let u=0;u<8;++u)o[u]=0;const{data:a,size:n,indices:s}=this.position;for(let u=0;u<r;++u){let h=0;const m=this._numIndexPerPrimitive*this.primitiveIndices[u];let p=n*s[m],v=a[p],x=a[p+1],_=a[p+2];for(let A=1;A<this._numIndexPerPrimitive;++A){p=n*s[m+A];const P=a[p],F=a[p+1],D=a[p+2];P<v&&(v=P),F<x&&(x=F),D<_&&(_=D)}v<e[0]&&(h|=1),x<e[1]&&(h|=2),_<e[2]&&(h|=4),i[u]=h,++o[h]}let l=0;for(let u=0;u<8;++u)o[u]>0&&++l;if(l<2)return;const c=new Array(8);for(let u=0;u<8;++u)c[u]=o[u]>0?new Uint32Array(o[u]):void 0;for(let u=0;u<8;++u)o[u]=0;for(let u=0;u<r;++u){const h=i[u];c[h][o[h]++]=this.primitiveIndices[u]}this._children=new Array;for(let u=0;u<8;++u)c[u]!==void 0&&this._children.push(new ta(c[u],this._numIndexPerPrimitive,this.position));return this._children}static prune(){et.prune()}};const et=new An({deallocator:null});function sl(t){return t?{p0:it(t.p0),p1:it(t.p1),p2:it(t.p2)}:{p0:C(),p1:C(),p2:C()}}function Mh(t,e,r){return De(ei,e,t),De(so,r,t),.5*pe(bi(ei,ei,so))}new ir(Go);new ir(()=>sl());const ei=C(),so=C();var fi;(function(t){t[t.Mesh=0]="Mesh",t[t.Point=1]="Point",t[t.Line=2]="Line"})(fi||(fi={}));var ce;function rt(t,e){switch(e.textureCoordinateType){case ce.Default:return t.attributes.add(T.UV0,"vec2"),t.varyings.add("vuv0","vec2"),void t.vertex.code.add(d`void forwardTextureCoordinates() { vuv0 = uv0; }`);case ce.Atlas:return t.attributes.add(T.UV0,"vec2"),t.attributes.add(T.UVREGION,"vec4"),t.varyings.add("vuv0","vec2"),t.varyings.add("vuvRegion","vec4"),void t.vertex.code.add(d`void forwardTextureCoordinates() {
vuv0 = uv0;
vuvRegion = uvRegion;
}`);default:xi(e.textureCoordinateType);case ce.None:return void t.vertex.code.add(d`void forwardTextureCoordinates() {}`);case ce.COUNT:return}}(function(t){t[t.None=0]="None",t[t.Default=1]="Default",t[t.Atlas=2]="Atlas",t[t.COUNT=3]="COUNT"})(ce||(ce={}));function ll(t){t.fragment.code.add(d`vec4 textureAtlasLookup(sampler2D tex, vec2 textureCoordinates, vec4 atlasRegion) {
vec2 atlasScale = atlasRegion.zw - atlasRegion.xy;
vec2 uvAtlas = fract(textureCoordinates) * atlasScale + atlasRegion.xy;
float maxdUV = 0.125;
vec2 dUVdx = clamp(dFdx(textureCoordinates), -maxdUV, maxdUV) * atlasScale;
vec2 dUVdy = clamp(dFdy(textureCoordinates), -maxdUV, maxdUV) * atlasScale;
return textureGrad(tex, uvAtlas, dUVdx, dUVdy);
}`)}function Ri(t,e){const{textureCoordinateType:r}=e;if(r===ce.None||r===ce.COUNT)return;t.include(rt,e);const i=r===ce.Atlas;i&&t.include(ll),t.fragment.code.add(d`
    vec4 textureLookup(sampler2D tex, vec2 uv) {
      return ${i?"textureAtlasLookup(tex, uv, vuvRegion)":"texture(tex, uv)"};
    }
  `)}let cl=class extends k{constructor(e,r){super(e,"float",S.Draw,(i,o,a)=>i.setUniform1f(e,r(o,a)))}},We=class extends k{constructor(e,r){super(e,"float",S.Pass,(i,o,a)=>i.setUniform1f(e,r(o,a)))}},fe=class extends k{constructor(e,r){super(e,"sampler2D",S.Pass,(i,o,a)=>i.bindTexture(e,r(o,a)))}},dl=class{constructor(e){this._material=e.material,this._techniques=e.techniques,this._output=e.output}dispose(){}get _stippleTextures(){return this._techniques.context.stippleTextures}get _markerTextures(){return this._techniques.context.markerTextures}getTechnique(e,r){return this._techniques.get(e,this._material.getConfiguration(this._output,r))}ensureResources(e){return di.LOADED}},ul=class{};const ar=ul;let hl=class extends dl{constructor(e){super(e),this._numLoading=0,this._disposed=!1,this._textures=e.textures,this.updateTexture(e.textureId),this._acquire(e.normalTextureId,r=>this._textureNormal=r),this._acquire(e.emissiveTextureId,r=>this._textureEmissive=r),this._acquire(e.occlusionTextureId,r=>this._textureOcclusion=r),this._acquire(e.metallicRoughnessTextureId,r=>this._textureMetallicRoughness=r)}dispose(){super.dispose(),this._texture=Ke(this._texture),this._textureNormal=Ke(this._textureNormal),this._textureEmissive=Ke(this._textureEmissive),this._textureOcclusion=Ke(this._textureOcclusion),this._textureMetallicRoughness=Ke(this._textureMetallicRoughness),this._disposed=!0}ensureResources(e){return this._numLoading===0?di.LOADED:di.LOADING}get textureBindParameters(){return new pl(this._texture?.glTexture??null,this._textureNormal?.glTexture??null,this._textureEmissive?.glTexture??null,this._textureOcclusion?.glTexture??null,this._textureMetallicRoughness?.glTexture??null)}updateTexture(e){this._texture!=null&&e===this._texture.id||(this._texture=Ke(this._texture),this._acquire(e,r=>this._texture=r))}_acquire(e,r){if(e==null)return void r(null);const i=this._textures.acquire(e);if(Rn(i))return++this._numLoading,void i.then(o=>{if(this._disposed)return Ke(o),void r(null);r(o)}).finally(()=>--this._numLoading);r(i)}},ml=class extends ar{constructor(e=null){super(),this.textureEmissive=e}},pl=class extends ml{constructor(e,r,i,o,a,n,s){super(i),this.texture=e,this.textureNormal=r,this.textureOcclusion=o,this.textureMetallicRoughness=a,this.scale=n,this.normalTextureTransformMatrix=s}};var me;(function(t){t[t.None=0]="None",t[t.SymbolColor=1]="SymbolColor",t[t.EmissiveColor=2]="EmissiveColor",t[t.Texture=3]="Texture",t[t.COUNT=4]="COUNT"})(me||(me={}));function fl(t,e){if(!Je(e.output))return;const{emissionSource:r,hasEmissiveTextureTransform:i,bindType:o}=e,a=r===me.Texture;a&&(t.include(Ri,e),t.fragment.uniforms.add(o===S.Pass?new fe("texEmission",c=>c.textureEmissive):new Kt("texEmission",c=>c.textureEmissive)));const n=r===me.EmissiveColor||a;n&&t.fragment.uniforms.add(o===S.Pass?new ae("emissiveBaseColor",c=>c.emissiveBaseColor):new be("emissiveBaseColor",c=>c.emissiveBaseColor));const s=r!==me.None;s&&t.fragment.uniforms.add(o===S.Pass?new We("emissiveStrength",c=>c.emissiveStrength):new cl("emissiveStrength",c=>c.emissiveStrength));const l=r===me.SymbolColor;t.fragment.code.add(d`
    vec4 getEmissions(vec3 symbolColor) {
      vec4 emissions = ${n?"vec4(emissiveBaseColor, 1.0)":l?"vec4(symbolColor, 1.0)":"vec4(0.0)"};
      ${$(a,`emissions *= textureLookup(texEmission, ${i?"emissiveUV":"vuv0"});
         emissions.w = emissions.rgb == vec3(0.0) ? 0.0: emissions.w;`)}
      ${$(s,"emissions.rgb *= emissiveStrength;")}
      return emissions;
    }
  `)}function gl(t,e){const r=t.fragment;switch(r.code.add(d`struct ShadingNormalParameters {
vec3 normalView;
vec3 viewDirection;
} shadingParams;`),e.doubleSidedMode){case ve.None:r.code.add(d`vec3 shadingNormal(ShadingNormalParameters params) {
return normalize(params.normalView);
}`);break;case ve.View:r.code.add(d`vec3 shadingNormal(ShadingNormalParameters params) {
return dot(params.normalView, params.viewDirection) > 0.0 ? normalize(-params.normalView) : normalize(params.normalView);
}`);break;case ve.WindingOrder:r.code.add(d`vec3 shadingNormal(ShadingNormalParameters params) {
return gl_FrontFacing ? normalize(params.normalView) : normalize(-params.normalView);
}`);break;default:xi(e.doubleSidedMode);case ve.COUNT:}}var ve;(function(t){t[t.None=0]="None",t[t.View=1]="View",t[t.WindingOrder=2]="WindingOrder",t[t.COUNT=3]="COUNT"})(ve||(ve={}));function Ph({normalTexture:t,metallicRoughnessTexture:e,metallicFactor:r,roughnessFactor:i,emissiveTexture:o,emissiveFactor:a,occlusionTexture:n}){return t==null&&e==null&&o==null&&(a==null||qt(a,Ct))&&n==null&&(i==null||i===1)&&(r==null||r===1)}const vl=Zt(1,1,.5),Dh=Zt(0,.6,.2),Lh=Zt(0,1,.2);var L;(function(t){t[t.Disabled=0]="Disabled",t[t.Normal=1]="Normal",t[t.Schematic=2]="Schematic",t[t.Water=3]="Water",t[t.WaterOnIntegratedMesh=4]="WaterOnIntegratedMesh",t[t.Simplified=5]="Simplified",t[t.TerrainWithWater=6]="TerrainWithWater",t[t.COUNT=7]="COUNT"})(L||(L={}));function ra(t,e){const r=e.pbrMode,i=t.fragment;if(r!==L.Schematic&&r!==L.Disabled&&r!==L.Normal)return void i.code.add(d`void applyPBRFactors() {}`);if(r===L.Disabled)return void i.code.add(d`void applyPBRFactors() {}
float getBakedOcclusion() { return 1.0; }`);if(r===L.Schematic)return void i.code.add(d`vec3 mrr = vec3(0.0, 0.6, 0.2);
float occlusion = 1.0;
void applyPBRFactors() {}
float getBakedOcclusion() { return 1.0; }`);const{hasMetallicRoughnessTexture:o,hasMetallicRoughnessTextureTransform:a,hasOcclusionTexture:n,hasOcclusionTextureTransform:s,bindType:l}=e;(o||n)&&t.include(Ri,e),i.code.add(d`vec3 mrr;
float occlusion;`),o&&i.uniforms.add(l===S.Pass?new fe("texMetallicRoughness",c=>c.textureMetallicRoughness):new Kt("texMetallicRoughness",c=>c.textureMetallicRoughness)),n&&i.uniforms.add(l===S.Pass?new fe("texOcclusion",c=>c.textureOcclusion):new Kt("texOcclusion",c=>c.textureOcclusion)),i.uniforms.add(l===S.Pass?new ae("mrrFactors",c=>c.mrrFactors):new be("mrrFactors",c=>c.mrrFactors)),i.code.add(d`
    ${$(o,d`void applyMetallicRoughness(vec2 uv) {
            vec3 metallicRoughness = textureLookup(texMetallicRoughness, uv).rgb;
            mrr[0] *= metallicRoughness.b;
            mrr[1] *= metallicRoughness.g;
          }`)}

    ${$(n,"void applyOcclusion(vec2 uv) { occlusion *= textureLookup(texOcclusion, uv).r; }")}

    float getBakedOcclusion() {
      return ${n?"occlusion":"1.0"};
    }

    void applyPBRFactors() {
      mrr = mrrFactors;
      occlusion = 1.0;

      ${$(o,`applyMetallicRoughness(${a?"metallicRoughnessUV":"vuv0"});`)}
      ${$(n,`applyOcclusion(${s?"occlusionUV":"vuv0"});`)}
    }
  `)}const ia=new Map([[T.POSITION,0],[T.NORMAL,1],[T.NORMALCOMPRESSED,1],[T.UV0,2],[T.UVI,2],[T.COLOR,3],[T.COLORFEATUREATTRIBUTE,3],[T.SIZE,4],[T.TANGENT,4],[T.CENTEROFFSETANDDISTANCE,5],[T.SYMBOLCOLOR,5],[T.FEATUREATTRIBUTE,6],[T.INSTANCEFEATUREATTRIBUTE,6],[T.OLIDCOLOR,6],[T.INSTANCEOBJECTANDLAYERIDCOLOR,6],[T.INSTANCECOLOR,7],[T.ROTATION,8],[T.INSTANCEMODEL,8],[T.INSTANCEMODELNORMAL,12],[T.INSTANCEMODELORIGINHI,11],[T.INSTANCEMODELORIGINLO,15]]);let Tl=class{constructor(e){this._bits=[...e]}equals(e){return No(this._bits,e.bits)}get code(){return this._code??(this._code=String.fromCharCode(...this._bits)),this._code}get bits(){return this._bits}},xl=class extends ar{constructor(){super(),this._parameterBits=this._parameterBits?.map(()=>0)??[],this._parameterNames??(this._parameterNames=[])}get key(){return this._key??(this._key=new Tl(this._parameterBits)),this._key}decode(e=this.key){const r=this._parameterBits;this._parameterBits=[...e.bits];const i=this._parameterNames.map(o=>`    ${o}: ${this[o]}`).join(`
`);return this._parameterBits=r,i}};function y(t={}){return(e,r)=>{e.hasOwnProperty("_parameterNames")||Object.defineProperty(e,"_parameterNames",{value:e._parameterNames?.slice()??[],configurable:!0,writable:!0}),e.hasOwnProperty("_parameterBits")||Object.defineProperty(e,"_parameterBits",{value:e._parameterBits?.slice()??[0],configurable:!0,writable:!0}),e._parameterNames.push(r);const i=t.count||2,o=Math.ceil(Math.log2(i)),a=e._parameterBits;let n=0;for(;a[n]+o>16;)n++,n>=a.length&&a.push(0);const s=a[n],l=(1<<o)-1<<s;a[n]+=o,t.count?Object.defineProperty(e,r,{get(){return(this._parameterBits[n]&l)>>s},set(c){if(this[r]!==c){if(this._key=null,this._parameterBits[n]=this._parameterBits[n]&~l|+c<<s&l,typeof c!="number")throw new X("internal:invalid-shader-configuration",`Configuration value for ${r} must be a number, got ${typeof c}`);if(t.count==null)throw new X("internal:invalid-shader-configuration",`Configuration value for ${r} must provide a count option`)}}}):Object.defineProperty(e,r,{get(){return!!((this._parameterBits[n]&l)>>s)},set(c){if(this[r]!==c&&(this._key=null,this._parameterBits[n]=this._parameterBits[n]&~l|+c<<s&l,typeof c!="boolean"))throw new X("internal:invalid-shader-configuration",`Configuration value for ${r} must be boolean, got ${typeof c}`)}})}}let _l=class extends xl{constructor(){super(...arguments),this.instancedDoublePrecision=!1,this.hasModelTransformation=!1}};var ie;(function(t){t[t.NONE=0]="NONE",t[t.ColorAlpha=1]="ColorAlpha",t[t.FrontFace=2]="FrontFace",t[t.COUNT=3]="COUNT"})(ie||(ie={}));let xt=class extends _l{constructor(){super(...arguments),this.output=j.Color,this.oitPass=ie.NONE,this.hasSlicePlane=!1,this.hasHighlightMixTexture=!1,this.bindType=S.Pass,this.writeDepth=!0}};f([y({count:j.COUNT})],xt.prototype,"output",void 0),f([y({count:ie.COUNT})],xt.prototype,"oitPass",void 0),f([y()],xt.prototype,"hasSlicePlane",void 0),f([y()],xt.prototype,"hasHighlightMixTexture",void 0);const ti=()=>dt.getLogger("esri.views.3d.support.geometryUtils.boundedPlane");let El=class{constructor(){this.plane=Lr(),this.origin=C(),this.basis1=C(),this.basis2=C()}};const bl=El;function nr(t=ma){return{plane:Lr(t.plane),origin:it(t.origin),basis1:it(t.basis1),basis2:it(t.basis2)}}function Sl(t,e,r){const i=Gl.get();return i.origin=t,i.basis1=e,i.basis2=r,i.plane=us(0,0,0,0),Ur(i),i}function Br(t,e=nr()){return oa(t.origin,t.basis1,t.basis2,e)}function wl(t,e){oe(e.origin,t.origin),oe(e.basis1,t.basis1),oe(e.basis2,t.basis2),hs(e.plane,t.plane)}function oa(t,e,r,i=nr()){return oe(i.origin,t),oe(i.basis1,e),oe(i.basis2,r),Ur(i),Bl(i,"fromValues()"),i}function Ur(t){pi(t.basis2,t.basis1,t.origin,t.plane)}function aa(t,e,r){t!==r&&Br(t,r);const i=Pe(ne.get(),je(t),e);return Ye(r.origin,r.origin,i),r.plane[3]-=e,r}function Ml(t,e,r){return na(e,r),aa(r,Oi(t,t.origin),r),r}function Al(t,e){const r=t.basis1[0],i=t.basis2[1],[o,a]=t.origin;return yn(o-r,a-i,o+r,a+i,e)}function na(t,e=nr()){const r=(t[2]-t[0])/2,i=(t[3]-t[1])/2;return te(e.origin,t[0]+r,t[1]+i,0),te(e.basis1,r,0,0),te(e.basis2,0,i,0),ms(0,0,1,0,e.plane),e}function yi(t,e,r){return!!ps(t.plane,e,r)&&ua(t,r)}function Rl(t,e,r){if(yi(t,e,r))return r;const i=sa(t,e,ne.get());return Ye(r,e.origin,Pe(ne.get(),e.direction,ts(e.origin,i)/pe(e.direction))),r}function sa(t,e,r){const i=Rr.get();ha(t,e,i,Rr.get());let o=Number.POSITIVE_INFINITY;for(const a of Ni){const n=Ii(t,a,Gr.get()),s=ne.get();if(fs(i,n,s)){const l=rs(ne.get(),e.origin,s),c=Math.abs(Cn(ot(e.direction,l)));c<o&&(o=c,oe(r,s))}}return o===Number.POSITIVE_INFINITY?la(t,e,r):r}function yl(t,e){return(e-t)/e}function la(t,e,r){if(yi(t,e,r))return r;const i=Rr.get(),o=Rr.get();ha(t,e,i,o);let a=Number.POSITIVE_INFINITY;for(const n of Ni){const s=Ii(t,n,Gr.get()),l=ne.get();if(gs(i,s,l)){const c=os(e,l);if(!zo(o,l))continue;c<a&&(a=c,oe(r,l))}}return Ci(t,e.origin)<a&&ca(t,e.origin,r),r}function ca(t,e,r){const i=vs(t.plane,e,ne.get()),o=eo(lo(t,t.basis1),i,-1,1,ne.get()),a=eo(lo(t,t.basis2),i,-1,1,ne.get());return De(r,Ye(ne.get(),o,a),t.origin),r}function da(t,e,r){const{origin:i,basis1:o,basis2:a}=t,n=De(ne.get(),e,i),s=gr(o,n),l=gr(a,n),c=gr(je(t),n);return te(r,s,l,c)}function Ci(t,e){const r=da(t,e,ne.get()),{basis1:i,basis2:o}=t,a=pe(i),n=pe(o),s=Math.max(Math.abs(r[0])-a,0),l=Math.max(Math.abs(r[1])-n,0),c=r[2];return s*s+l*l+c*c}function Cl(t,e){return Math.sqrt(Ci(t,e))}function Ol(t,e){let r=Number.NEGATIVE_INFINITY;for(const i of Ni){const o=Ii(t,i,Gr.get()),a=as(o,e);a>r&&(r=a)}return Math.sqrt(r)}function Il(t,e){return zo(t.plane,e)&&ua(t,e)}function Nl(t,e,r,i){return Fl(t,r,i)}function Oi(t,e){const r=-t.plane[3];return gr(je(t),e)-r}function $l(t,e,r,i){const o=Oi(t,e),a=Pe(Ul,je(t),r-o);return Ye(i,e,a),i}function Pl(t,e){return qt(t.basis1,e.basis1)&&qt(t.basis2,e.basis2)&&qt(t.origin,e.origin)}function Dl(t,e,r){return t!==r&&Br(t,r),On(ft,e),In(ft,ft),Ce(r.basis1,t.basis1,ft),Ce(r.basis2,t.basis2,ft),Ce(Mr(r.plane),Mr(t.plane),ft),Ce(r.origin,t.origin,e),Ts(r.plane,r.plane,r.origin),r}function Ll(t,e,r,i){return t!==i&&Br(t,i),Nn(ri,e,r),Ce(i.basis1,t.basis1,ri),Ce(i.basis2,t.basis2,ri),Ur(i),i}function je(t){return Mr(t.plane)}function Fl(t,e,r){switch(e){case Zr.X:oe(r,t.basis1),Jt(r,r);break;case Zr.Y:oe(r,t.basis2),Jt(r,r);break;case Zr.Z:oe(r,je(t))}return r}function ua(t,e){const r=De(ne.get(),e,t.origin),i=Qi(t.basis1),o=Qi(t.basis2),a=ot(t.basis1,r),n=ot(t.basis2,r);return-a-i<0&&a-i<0&&-n-o<0&&n-o<0}function lo(t,e){const r=Gr.get();return oe(r.origin,t.origin),oe(r.vector,e),r}function Ii(t,e,r){const{basis1:i,basis2:o,origin:a}=t,n=Pe(ne.get(),i,e.origin[0]),s=Pe(ne.get(),o,e.origin[1]);Ye(r.origin,n,s),Ye(r.origin,r.origin,a);const l=Pe(ne.get(),i,e.direction[0]),c=Pe(ne.get(),o,e.direction[1]);return Pe(r.vector,Ye(l,l,c),2),r}function Bl(t,e){Math.abs(ot(t.basis1,t.basis2)/(pe(t.basis1)*pe(t.basis2)))>1e-6&&ti().warn(e,"Provided basis vectors are not perpendicular"),Math.abs(ot(t.basis1,je(t)))>1e-6&&ti().warn(e,"Basis vectors and plane normal are not perpendicular"),Math.abs(-ot(je(t),t.origin)-t.plane[3])>1e-6&&ti().warn(e,"Plane offset is not consistent with plane origin")}function ha(t,e,r,i){const o=je(t);pi(o,e.direction,e.origin,r),pi(Mr(r),o,e.origin,i)}const ma={plane:Lr(),origin:kt(0,0,0),basis1:kt(1,0,0),basis2:kt(0,1,0)},Rr=new ir(Lr),Gr=new ir(Go),Ul=C(),Gl=new ir(()=>nr()),Ni=[{origin:[-1,-1],direction:[1,0]},{origin:[1,-1],direction:[0,1]},{origin:[1,1],direction:[-1,0]},{origin:[-1,1],direction:[0,-1]}],ft=or(),ri=or(),Vh=Object.freeze(Object.defineProperty({__proto__:null,BoundedPlaneClass:bl,altitudeAt:Oi,axisAt:Nl,cameraFrustumCoverage:yl,closestPoint:la,closestPointOnSilhouette:sa,copy:Br,copyWithoutVerify:wl,create:nr,distance:Cl,distance2:Ci,distanceToSilhouette:Ol,elevate:aa,equals:Pl,extrusionContainsPoint:Il,fromAABoundingRect:na,fromValues:oa,getExtent:Al,intersectRay:yi,intersectRayClosestSilhouette:Rl,normal:je,projectPoint:ca,projectPointLocal:da,rotate:Ll,setAltitudeAt:$l,setExtent:Ml,transform:Dl,up:ma,updateUnboundedPlane:Ur,wrap:Sl},Symbol.toStringTag,{value:"Module"}));function zl(t){return Math.abs(t*t*t)}function pa(t,e,r){const i=r.parameters;return ii.scale=Math.min(i.divisor/(e-i.offset),1),ii.factor=zl(t),ii}function fa(t,e){return $n(t*Math.max(e.scale,e.minScaleFactor),t,e.factor)}function Vl(t,e,r){const i=pa(t,e,r);return i.minScaleFactor=0,fa(1,i)}function Hh(t,e,r,i){i.scale=Vl(t,e,r),i.factor=0,i.minScaleFactor=r.minScaleFactor}function Wh(t,e,r=[0,0]){const i=Math.min(Math.max(e.scale,e.minScaleFactor),1);return r[0]=t[0]*i,r[1]=t[1]*i,r}function Hl(t,e,r,i){return fa(t,pa(e,r,i))}const ii={scale:0,factor:0,minScaleFactor:0};function Wl(t,e,r,i,o){let a=(r.screenLength||0)*t.pixelRatio;o!=null&&(a=Hl(a,i,e,o));const n=a*Math.tan(.5*t.fovY)/(.5*t.fullHeight);return _i(n*e,r.minWorldLength||0,r.maxWorldLength!=null?r.maxWorldLength:1/0)}function co(t,e){let r=!1;for(const i in e){const o=e[i];o!==void 0&&(Array.isArray(o)?Array.isArray(t[i])&&No(o,t[i])||(t[i]=o.slice(),r=!0):t[i]!==o&&(r=!0,t[i]=o))}return r}const jl={multiply:1,ignore:2,replace:3,tint:4};let kl=class{constructor(e,r){this.id=Io(),this.supportsEdges=!1,this.vertexAttributeLocations=ia,this._renderPriority=0,this._parameters=new r,co(this._parameters,e),this.validateParameters(this._parameters)}get parameters(){return this._parameters}update(e){return!1}setParameters(e,r=!0){co(this._parameters,e)&&(this.validateParameters(this._parameters),r&&this._parametersChanged())}validateParameters(e){}shouldRender(e){return this.visible&&this.isVisibleForOutput(e.output)&&(!this.parameters.isDecoration||e.bind.decorations)&&(this.parameters.renderOccluded&e.renderOccludedMask)!==0}isVisibleForOutput(e){return!0}get renderPriority(){return this._renderPriority}set renderPriority(e){e!==this._renderPriority&&(this._renderPriority=e,this._parametersChanged())}_parametersChanged(){this.repository?.materialChanged(this)}get renderOccludedFlags(){return this.visible?this.parameters.renderOccluded:yr.None}get hasEmissions(){return!1}getConfiguration(e,r,i=new xt){return i.output=e,i.hasHighlightMixTexture=e===j.Highlight&&r.highlightMixTexture!=null,i}};var yr;(function(t){t[t.None=0]="None",t[t.Occlude=1]="Occlude",t[t.Transparent=2]="Transparent",t[t.OccludeAndTransparent=4]="OccludeAndTransparent",t[t.OccludeAndTransparentStencil=8]="OccludeAndTransparentStencil",t[t.Opaque=16]="Opaque"})(yr||(yr={}));function zr(t,e,r=hi.ADD,i=[0,0,0,0]){return{srcRgb:t,srcAlpha:t,dstRgb:e,dstAlpha:e,opRgb:r,opAlpha:r,color:{r:i[0],g:i[1],b:i[2],a:i[3]}}}function ga(t,e,r,i,o=hi.ADD,a=hi.ADD,n=[0,0,0,0]){return{srcRgb:t,srcAlpha:e,dstRgb:r,dstAlpha:i,opRgb:o,opAlpha:a,color:{r:n[0],g:n[1],b:n[2],a:n[3]}}}zr(se.ZERO,se.ONE_MINUS_SRC_ALPHA);zr(se.ONE,se.ZERO);zr(se.ONE,se.ONE);const ql=zr(se.ONE,se.ONE_MINUS_SRC_ALPHA),Xl=ga(se.SRC_ALPHA,se.ONE,se.ONE_MINUS_SRC_ALPHA,se.ONE_MINUS_SRC_ALPHA),Yl={face:Lo.BACK,mode:Fo.CCW},Zl={face:Lo.FRONT,mode:Fo.CCW},Jl=t=>t===nt.Back?Yl:t===nt.Front?Zl:null,Kl={zNear:0,zFar:1},Vr={r:!0,g:!0,b:!0,a:!0};function Ql(t){return lc.intern(t)}function ec(t){return cc.intern(t)}function tc(t){return dc.intern(t)}function rc(t){return uc.intern(t)}function ic(t){return hc.intern(t)}function oc(t){return mc.intern(t)}function ac(t){return pc.intern(t)}function nc(t){return fc.intern(t)}function sc(t){return gc.intern(t)}function Hr(t){return vc.intern(t)}let Be=class{constructor(e,r){this._makeKey=e,this._makeRef=r,this._interns=new Map}intern(e){if(!e)return null;const r=this._makeKey(e),i=this._interns;return i.has(r)||i.set(r,this._makeRef(e)),i.get(r)??null}};function Ue(t){return"["+t.join(",")+"]"}const lc=new Be(va,t=>({__tag:"Blending",...t}));function va(t){return t?Ue([t.srcRgb,t.srcAlpha,t.dstRgb,t.dstAlpha,t.opRgb,t.opAlpha,t.color.r,t.color.g,t.color.b,t.color.a]):null}const cc=new Be(Ta,t=>({__tag:"Culling",...t}));function Ta(t){return t?Ue([t.face,t.mode]):null}const dc=new Be(xa,t=>({__tag:"PolygonOffset",...t}));function xa(t){return t?Ue([t.factor,t.units]):null}const uc=new Be(_a,t=>({__tag:"DepthTest",...t}));function _a(t){return t?Ue([t.func]):null}const hc=new Be(Ea,t=>({__tag:"StencilTest",...t}));function Ea(t){return t?Ue([t.function.func,t.function.ref,t.function.mask,t.operation.fail,t.operation.zFail,t.operation.zPass]):null}const mc=new Be(ba,t=>({__tag:"DepthWrite",...t}));function ba(t){return t?Ue([t.zNear,t.zFar]):null}const pc=new Be(Sa,t=>({__tag:"ColorWrite",...t}));function Sa(t){return t?Ue([t.r,t.g,t.b,t.a]):null}const fc=new Be(wa,t=>({__tag:"StencilWrite",...t}));function wa(t){return t?Ue([t.mask]):null}const gc=new Be(Ma,t=>({__tag:"DrawBuffers",...t}));function Ma(t){return t?Ue(t.buffers):null}const vc=new Be(Tc,t=>({blending:Ql(t.blending),culling:ec(t.culling),polygonOffset:tc(t.polygonOffset),depthTest:rc(t.depthTest),stencilTest:ic(t.stencilTest),depthWrite:oc(t.depthWrite),colorWrite:ac(t.colorWrite),stencilWrite:nc(t.stencilWrite),drawBuffers:sc(t.drawBuffers)}));function Tc(t){return t?Ue([va(t.blending),Ta(t.culling),xa(t.polygonOffset),_a(t.depthTest),Ea(t.stencilTest),ba(t.depthWrite),Sa(t.colorWrite),wa(t.stencilWrite),Ma(t.drawBuffers)]):null}const Aa=ga(se.ONE,se.ZERO,se.ONE,se.ONE_MINUS_SRC_ALPHA);function qh(t){return t===ie.FrontFace?null:Aa}function xc(t){switch(t){case ie.NONE:return Xl;case ie.ColorAlpha:return Aa;case ie.FrontFace:case ie.COUNT:return null}}function _c(t){if(t.draped)return null;switch(t.oitPass){case ie.NONE:case ie.FrontFace:return t.writeDepth?Kl:null;case ie.ColorAlpha:case ie.COUNT:return null}}const Ec=5e5,bc={factor:-1,units:-2};function Sc({oitPass:t,enableOffset:e}){return e&&t===ie.ColorAlpha?bc:null}function wc(t,e=Le.LESS){return t===ie.NONE||t===ie.FrontFace?e:Le.LEQUAL}function Mc(t,e){const r=Si(e);return t===ie.ColorAlpha?r?{buffers:[Jr,Kr,Wn]}:{buffers:[Jr,Kr]}:r?{buffers:[Jr,Kr]}:null}let Ac=class{constructor(e=!1,r=!0){this.isVerticalRay=e,this.normalRequired=r}};const mr=Pn();function Rc(t,e,r,i,o,a){if(!t.visible)return;const n=at(Gc,i,r),s=(c,u,h)=>{a(c,h,u)},l=new Ac(!1,e.options.normalRequired);if(t.boundingInfo){q(t.type===fi.Mesh);const c=e.tolerance;Ra(t.boundingInfo,r,n,c,o,l,s)}else{const c=t.attributes.get(T.POSITION),u=c.indices;Ic(r,n,0,u.length/3,u,c.data,c.stride,o,l,s)}}const yc=C();function Ra(t,e,r,i,o,a,n){if(t==null)return;const s=Lc(r,yc);if(Dn(mr,t.bbMin),Ln(mr,t.bbMax),o?.applyToAabb(mr),Fc(mr,e,s,i)){const{primitiveIndices:l,position:c}=t,u=l?l.length:c.indices.length/3;if(u>Uc){const h=t.getChildren();if(h!==void 0){for(const m of h)Ra(m,e,r,i,o,a,n);return}}Oc(e,r,0,u,c.indices,c.data,c.stride,l,o,a,n)}}const _t=C();function Cc(t,e,r,i,o,a,n,s){const l=t[0],c=t[1],u=t[2],h=e[0],m=e[1],p=e[2];for(let v=r;v<i;++v){const x=3*v,_=x+1,A=x+2,P=a*x,F=o[P],D=o[P+1],z=o[P+2],V=a*_,w=a*A,E=o[V]-F,O=o[V+1]-D,I=o[V+2]-z,b=o[w]-F,M=o[w+1]-D,R=o[w+2]-z,H=m*R-M*p,Z=p*b-R*h,Q=h*M-b*m,ee=E*H+O*Z+I*Q;if(Math.abs(ee)<=Ca)continue;const Se=l-F,we=c-D,Me=u-z,ue=Se*H+we*Z+Me*Q;if(ee>0){if(ue<0||ue>ee)continue}else if(ue>0||ue<ee)continue;const Te=we*I-O*Me,Ie=Me*E-I*Se,Ne=Se*O-E*we,Ae=h*Te+m*Ie+p*Ne;if(ee>0){if(Ae<0||ue+Ae>ee)continue}else if(Ae>0||ue+Ae<ee)continue;const he=(b*Te+M*Ie+R*Ne)/ee;he>=0&&s(he,v,n?ya(E,O,I,b,M,R,_t):null)}}function Oc(t,e,r,i,o,a,n,s,l,c,u){const h=t[0],m=t[1],p=t[2],v=e[0],x=e[1],_=e[2],{normalRequired:A}=c;for(let P=r;P<i;++P){const F=s[P],D=3*F,z=n*o[D];let V=a[z],w=a[z+1],E=a[z+2];const O=n*o[D+1];let I=a[O],b=a[O+1],M=a[O+2];const R=n*o[D+2];let H=a[R],Z=a[R+1],Q=a[R+2];l!=null&&([V,w,E]=l.applyToVertex(V,w,E,P),[I,b,M]=l.applyToVertex(I,b,M,P),[H,Z,Q]=l.applyToVertex(H,Z,Q,P));const ee=I-V,Se=b-w,we=M-E,Me=H-V,ue=Z-w,Te=Q-E,Ie=x*Te-ue*_,Ne=_*Me-Te*v,Ae=v*ue-Me*x,he=ee*Ie+Se*Ne+we*Ae;if(Math.abs(he)<=Ca)continue;const ut=h-V,Xr=m-w,Yr=p-E,ht=ut*Ie+Xr*Ne+Yr*Ae;if(he>0){if(ht<0||ht>he)continue}else if(ht>0||ht<he)continue;const Hi=Xr*we-Se*Yr,Wi=Yr*ee-we*ut,ji=ut*Se-ee*Xr,sr=v*Hi+x*Wi+_*ji;if(he>0){if(sr<0||ht+sr>he)continue}else if(sr>0||ht+sr<he)continue;const ki=(Me*Hi+ue*Wi+Te*ji)/he;ki>=0&&u(ki,F,A?ya(ee,Se,we,Me,ue,Te,_t):null)}}function Ic(t,e,r,i,o,a,n,s,l,c){const u=e,h=zc,m=Math.abs(u[0]),p=Math.abs(u[1]),v=Math.abs(u[2]),x=m>=p?m>=v?0:2:p>=v?1:2,_=x,A=u[_]<0?2:1,P=(x+A)%3,F=(x+(3-A))%3,D=u[P]/u[_],z=u[F]/u[_],V=1/u[_],w=Nc,E=$c,O=Pc,{normalRequired:I}=l;for(let b=r;b<i;++b){const M=3*b,R=n*o[M];te(h[0],a[R+0],a[R+1],a[R+2]);const H=n*o[M+1];te(h[1],a[H+0],a[H+1],a[H+2]);const Z=n*o[M+2];te(h[2],a[Z+0],a[Z+1],a[Z+2]),s&&(oe(h[0],s.applyToVertex(h[0][0],h[0][1],h[0][2],b)),oe(h[1],s.applyToVertex(h[1][0],h[1][1],h[1][2],b)),oe(h[2],s.applyToVertex(h[2][0],h[2][1],h[2][2],b))),at(w,h[0],t),at(E,h[1],t),at(O,h[2],t);const Q=w[P]-D*w[_],ee=w[F]-z*w[_],Se=E[P]-D*E[_],we=E[F]-z*E[_],Me=O[P]-D*O[_],ue=O[F]-z*O[_],Te=Me*we-ue*Se,Ie=Q*ue-ee*Me,Ne=Se*ee-we*Q;if((Te<0||Ie<0||Ne<0)&&(Te>0||Ie>0||Ne>0))continue;const Ae=Te+Ie+Ne;if(Ae===0)continue;const he=Te*(V*w[_])+Ie*(V*E[_])+Ne*(V*O[_]);if(he*Math.sign(Ae)<0)continue;const ut=he/Ae;ut>=0&&c(ut,b,I?Dc(h):null)}}const Nc=C(),$c=C(),Pc=C();function ya(t,e,r,i,o,a,n){return te(Cr,t,e,r),te(Or,i,o,a),bi(n,Cr,Or),Jt(n,n),n}function Dc(t){return at(Cr,t[1],t[0]),at(Or,t[2],t[0]),bi(_t,Cr,Or),Jt(_t,_t),_t}const Cr=C(),Or=C();function Lc(t,e){return te(e,1/t[0],1/t[1],1/t[2])}function Fc(t,e,r,i){return Bc(t,e,r,i,1/0)}function Bc(t,e,r,i,o){const a=(t[0]-i-e[0])*r[0],n=(t[3]+i-e[0])*r[0];let s=Math.min(a,n),l=Math.max(a,n);const c=(t[1]-i-e[1])*r[1],u=(t[4]+i-e[1])*r[1];if(l=Math.min(l,Math.max(c,u)),l<0||(s=Math.max(s,Math.min(c,u)),s>l))return!1;const h=(t[2]-i-e[2])*r[2],m=(t[5]+i-e[2])*r[2];return l=Math.min(l,Math.max(h,m)),!(l<0)&&(s=Math.max(s,Math.min(h,m)),!(s>l)&&s<o)}const Uc=1e3,Ca=1e-7,Gc=C(),zc=[C(),C(),C()];var Xt;(function(t){t[t.INTEGRATED_MESH=0]="INTEGRATED_MESH",t[t.OPAQUE_TERRAIN=1]="OPAQUE_TERRAIN",t[t.OPAQUE_MATERIAL=2]="OPAQUE_MATERIAL",t[t.OPAQUE_MATERIAL_WITHOUT_NORMALS=3]="OPAQUE_MATERIAL_WITHOUT_NORMALS",t[t.TRANSPARENT_MATERIAL=4]="TRANSPARENT_MATERIAL",t[t.TRANSPARENT_MATERIAL_WITHOUT_NORMALS=5]="TRANSPARENT_MATERIAL_WITHOUT_NORMALS",t[t.TRANSPARENT_TERRAIN=6]="TRANSPARENT_TERRAIN",t[t.TRANSPARENT_MATERIAL_WITHOUT_DEPTH=7]="TRANSPARENT_MATERIAL_WITHOUT_DEPTH",t[t.OCCLUDED_GROUND=8]="OCCLUDED_GROUND",t[t.OCCLUDER_MATERIAL=9]="OCCLUDER_MATERIAL",t[t.TRANSPARENT_OCCLUDER_MATERIAL=10]="TRANSPARENT_OCCLUDER_MATERIAL",t[t.OCCLUSION_PIXELS=11]="OCCLUSION_PIXELS",t[t.HUD_MATERIAL=12]="HUD_MATERIAL",t[t.LABEL_MATERIAL=13]="LABEL_MATERIAL",t[t.LINE_CALLOUTS=14]="LINE_CALLOUTS",t[t.LINE_CALLOUTS_HUD_DEPTH=15]="LINE_CALLOUTS_HUD_DEPTH",t[t.OVERLAY=16]="OVERLAY",t[t.DRAPED_MATERIAL=17]="DRAPED_MATERIAL",t[t.DRAPED_WATER=18]="DRAPED_WATER",t[t.VOXEL=19]="VOXEL",t[t.MAX_SLOTS=20]="MAX_SLOTS"})(Xt||(Xt={}));let Vc=class{constructor(e=0){this.componentLocalOriginLength=0,this._totalOffset=0,this._offset=0,this._tmpVertex=C(),this._tmpMbs=Uo(),this._tmpObb=new ns,this._resetOffset(e)}_resetOffset(e){this._offset=e,this._totalOffset=e}set offset(e){this._resetOffset(e)}get offset(){return this._offset}set componentOffset(e){this._totalOffset=this._offset+e}set localOrigin(e){this.componentLocalOriginLength=pe(e)}applyToVertex(e,r,i){const o=te(Oa,e,r,i),a=te(jc,e,r,i+this.componentLocalOriginLength),n=this._totalOffset/pe(a);return Tt(this._tmpVertex,o,a,n),this._tmpVertex}applyToAabb(e){const r=this.componentLocalOriginLength,i=e[0],o=e[1],a=e[2]+r,n=e[3],s=e[4],l=e[5]+r,c=Math.abs(i),u=Math.abs(o),h=Math.abs(a),m=Math.abs(n),p=Math.abs(s),v=Math.abs(l),x=.5*(1+Math.sign(i*n))*Math.min(c,m),_=.5*(1+Math.sign(o*s))*Math.min(u,p),A=.5*(1+Math.sign(a*l))*Math.min(h,v),P=Math.max(c,m),F=Math.max(u,p),D=Math.max(h,v),z=Math.sqrt(x*x+_*_+A*A),V=Math.sign(c+i),w=Math.sign(u+o),E=Math.sign(h+a),O=Math.sign(m+n),I=Math.sign(p+s),b=Math.sign(v+l),M=this._totalOffset;if(z<M)return e[0]-=(1-V)*M,e[1]-=(1-w)*M,e[2]-=(1-E)*M,e[3]+=O*M,e[4]+=I*M,e[5]+=b*M,e;const R=M/Math.sqrt(P*P+F*F+D*D),H=M/z,Z=H-R,Q=-Z;return e[0]+=i*(V*Q+H),e[1]+=o*(w*Q+H),e[2]+=a*(E*Q+H),e[3]+=n*(O*Z+R),e[4]+=s*(I*Z+R),e[5]+=l*(b*Z+R),e}applyToMbs(e){const r=pe(ke(e)),i=this._totalOffset/r;return Tt(ke(this._tmpMbs),ke(e),ke(e),i),this._tmpMbs[3]=e[3]+e[3]*this._totalOffset/r,this._tmpMbs}applyToObb(e){return ss(e,this._totalOffset,this._totalOffset,mi.Global,this._tmpObb),this._tmpObb}},Hc=class{constructor(e=0){this.offset=e,this.sphere=Uo(),this.tmpVertex=C()}applyToVertex(e,r,i){const o=this.objectTransform.transform,a=te(Oa,e,r,i),n=Ce(a,a,o),s=this.offset/pe(n);Tt(n,n,n,s);const l=this.objectTransform.inverse;return Ce(this.tmpVertex,n,l),this.tmpVertex}applyToMinMax(e,r){const i=this.offset/pe(e);Tt(e,e,e,i);const o=this.offset/pe(r);Tt(r,r,r,o)}applyToAabb(e){const r=this.offset/Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]);e[0]+=e[0]*r,e[1]+=e[1]*r,e[2]+=e[2]*r;const i=this.offset/Math.sqrt(e[3]*e[3]+e[4]*e[4]+e[5]*e[5]);return e[3]+=e[3]*i,e[4]+=e[4]*i,e[5]+=e[5]*i,e}applyToBoundingSphere(e){const r=pe(ke(e)),i=this.offset/r;return Tt(ke(this.sphere),ke(e),ke(e),i),this.sphere[3]=e[3]+e[3]*this.offset/r,this.sphere}};const uo=new Hc;function Wc(t){return t!=null?(uo.offset=t,uo):null}new Vc;const Oa=C(),jc=C();function Jh(t,e,r,i=1){const{data:o,indices:a}=t,n=e.typedBuffer,s=e.typedBufferStride,l=a.length;if(r*=s,i===1)for(let c=0;c<l;++c)n[r]=o[a[c]],r+=s;else for(let c=0;c<l;++c){const u=o[a[c]];for(let h=0;h<i;h++)n[r]=u,r+=s}}function oi(t,e,r){const{data:i,indices:o}=t,a=e.typedBuffer,n=e.typedBufferStride,s=o.length;r*=n;for(let l=0;l<s;++l){const c=2*o[l];a[r]=i[c],a[r+1]=i[c+1],r+=n}}function $i(t,e,r,i=1){const{data:o,indices:a}=t,n=e.typedBuffer,s=e.typedBufferStride,l=a.length;if(r*=s,i===1)for(let c=0;c<l;++c){const u=3*a[c];n[r]=o[u],n[r+1]=o[u+1],n[r+2]=o[u+2],r+=s}else for(let c=0;c<l;++c){const u=3*a[c];for(let h=0;h<i;++h)n[r]=o[u],n[r+1]=o[u+1],n[r+2]=o[u+2],r+=s}}function Ia(t,e,r,i=1){const{data:o,indices:a}=t,n=e.typedBuffer,s=e.typedBufferStride,l=a.length;if(r*=s,i===1)for(let c=0;c<l;++c){const u=4*a[c];n[r]=o[u],n[r+1]=o[u+1],n[r+2]=o[u+2],n[r+3]=o[u+3],r+=s}else for(let c=0;c<l;++c){const u=4*a[c];for(let h=0;h<i;++h)n[r]=o[u],n[r+1]=o[u+1],n[r+2]=o[u+2],n[r+3]=o[u+3],r+=s}}function Kh(t,e,r){const i=t.typedBuffer,o=t.typedBufferStride;e*=o;for(let a=0;a<r;++a)i[e]=0,i[e+1]=0,i[e+2]=0,i[e+3]=0,e+=o}function kc(t,e,r,i,o=1){if(!e)return void $i(t,r,i,o);const{data:a,indices:n}=t,s=r.typedBuffer,l=r.typedBufferStride,c=n.length,u=e[0],h=e[1],m=e[2],p=e[4],v=e[5],x=e[6],_=e[8],A=e[9],P=e[10],F=e[12],D=e[13],z=e[14];i*=l;let V=0,w=0,E=0;const O=$o(e)?I=>{V=a[I]+F,w=a[I+1]+D,E=a[I+2]+z}:I=>{const b=a[I],M=a[I+1],R=a[I+2];V=u*b+p*M+_*R+F,w=h*b+v*M+A*R+D,E=m*b+x*M+P*R+z};if(o===1)for(let I=0;I<c;++I)O(3*n[I]),s[i]=V,s[i+1]=w,s[i+2]=E,i+=l;else for(let I=0;I<c;++I){O(3*n[I]);for(let b=0;b<o;++b)s[i]=V,s[i+1]=w,s[i+2]=E,i+=l}}function qc(t,e,r,i,o=1){if(!e)return void $i(t,r,i,o);const{data:a,indices:n}=t,s=e,l=r.typedBuffer,c=r.typedBufferStride,u=n.length,h=s[0],m=s[1],p=s[2],v=s[4],x=s[5],_=s[6],A=s[8],P=s[9],F=s[10],D=!Po(s),z=1e-6,V=1-z;i*=c;let w=0,E=0,O=0;const I=$o(s)?b=>{w=a[b],E=a[b+1],O=a[b+2]}:b=>{const M=a[b],R=a[b+1],H=a[b+2];w=h*M+v*R+A*H,E=m*M+x*R+P*H,O=p*M+_*R+F*H};if(o===1)if(D)for(let b=0;b<u;++b){I(3*n[b]);const M=w*w+E*E+O*O;if(M<V&&M>z){const R=1/Math.sqrt(M);l[i]=w*R,l[i+1]=E*R,l[i+2]=O*R}else l[i]=w,l[i+1]=E,l[i+2]=O;i+=c}else for(let b=0;b<u;++b)I(3*n[b]),l[i]=w,l[i+1]=E,l[i+2]=O,i+=c;else for(let b=0;b<u;++b){if(I(3*n[b]),D){const M=w*w+E*E+O*O;if(M<V&&M>z){const R=1/Math.sqrt(M);w*=R,E*=R,O*=R}}for(let M=0;M<o;++M)l[i]=w,l[i+1]=E,l[i+2]=O,i+=c}}function Xc(t,e,r,i,o=1){if(!e)return void Ia(t,r,i,o);const{data:a,indices:n}=t,s=e,l=r.typedBuffer,c=r.typedBufferStride,u=n.length,h=s[0],m=s[1],p=s[2],v=s[4],x=s[5],_=s[6],A=s[8],P=s[9],F=s[10],D=!Po(s),z=1e-6,V=1-z;if(i*=c,o===1)for(let w=0;w<u;++w){const E=4*n[w],O=a[E],I=a[E+1],b=a[E+2],M=a[E+3];let R=h*O+v*I+A*b,H=m*O+x*I+P*b,Z=p*O+_*I+F*b;if(D){const Q=R*R+H*H+Z*Z;if(Q<V&&Q>z){const ee=1/Math.sqrt(Q);R*=ee,H*=ee,Z*=ee}}l[i]=R,l[i+1]=H,l[i+2]=Z,l[i+3]=M,i+=c}else for(let w=0;w<u;++w){const E=4*n[w],O=a[E],I=a[E+1],b=a[E+2],M=a[E+3];let R=h*O+v*I+A*b,H=m*O+x*I+P*b,Z=p*O+_*I+F*b;if(D){const Q=R*R+H*H+Z*Z;if(Q<V&&Q>z){const ee=1/Math.sqrt(Q);R*=ee,H*=ee,Z*=ee}}for(let Q=0;Q<o;++Q)l[i]=R,l[i+1]=H,l[i+2]=Z,l[i+3]=M,i+=c}}function Yc(t,e,r,i,o=1){const{data:a,indices:n}=t,s=r.typedBuffer,l=r.typedBufferStride,c=n.length;if(i*=l,e!==a.length||e!==4)if(o!==1)if(e!==4)for(let u=0;u<c;++u){const h=3*n[u];for(let m=0;m<o;++m)s[i]=a[h],s[i+1]=a[h+1],s[i+2]=a[h+2],s[i+3]=255,i+=l}else for(let u=0;u<c;++u){const h=4*n[u];for(let m=0;m<o;++m)s[i]=a[h],s[i+1]=a[h+1],s[i+2]=a[h+2],s[i+3]=a[h+3],i+=l}else{if(e===4){for(let u=0;u<c;++u){const h=4*n[u];s[i]=a[h],s[i+1]=a[h+1],s[i+2]=a[h+2],s[i+3]=a[h+3],i+=l}return}for(let u=0;u<c;++u){const h=3*n[u];s[i]=a[h],s[i+1]=a[h+1],s[i+2]=a[h+2],s[i+3]=255,i+=l}}else{s[i]=a[0],s[i+1]=a[1],s[i+2]=a[2],s[i+3]=a[3];const u=new Uint32Array(r.typedBuffer.buffer,r.start),h=l/4,m=u[i/=4];i+=h;const p=c*o;for(let v=1;v<p;++v)u[i]=m,i+=h}}function Zc(t,e,r){const{data:i,indices:o}=t,a=e.typedBuffer,n=e.typedBufferStride,s=o.length,l=i[0];r*=n;for(let c=0;c<s;++c)a[r]=l,r+=n}function Jc(t,e,r,i,o=1){const a=e.typedBuffer,n=e.typedBufferStride;if(i*=n,o===1)for(let s=0;s<r;++s)a[i]=t[0],a[i+1]=t[1],a[i+2]=t[2],a[i+3]=t[3],i+=n;else for(let s=0;s<r;++s)for(let l=0;l<o;++l)a[i]=t[0],a[i+1]=t[1],a[i+2]=t[2],a[i+3]=t[3],i+=n}function Kc(t,e,r,i,o,a,n){let s={numItems:0,numVerticesPerItem:0};for(const l of r.fields.keys()){const c=t.get(l),u=c?.indices;if(c&&u)l===T.POSITION&&(s={numItems:1,numVerticesPerItem:u.length}),Qc(l,c,i,o,a,n);else if(l===T.OLIDCOLOR&&e!=null){const h=t.get(T.POSITION)?.indices;if(h){const m=h.length;Jc(e,a.getField(l,Bo),m,n)}}}return s}function Qc(t,e,r,i,o,a){switch(t){case T.POSITION:{q(e.size===3);const n=o.getField(t,fr);q(!!n,`No buffer view for ${t}`),kc(e,r,n,a);break}case T.NORMAL:{q(e.size===3);const n=o.getField(t,fr);q(!!n,`No buffer view for ${t}`),qc(e,i,n,a);break}case T.NORMALCOMPRESSED:case T.PROFILERIGHT:case T.PROFILEUP:{q(e.size===2);const n=o.getField(t,Ji);q(!!n,`No buffer view for ${t}`),oi(e,n,a);break}case T.UV0:{q(e.size===2);const n=o.getField(t,Kn)??o.getField(t,Qn);q(!!n,`No buffer view for ${t}`),oi(e,n,a);break}case T.UVI:{q(e.size===2);const n=o.getField(t,Ji);q(!!n,`No buffer view for ${t}`),oi(e,n,a);break}case T.COLOR:case T.SYMBOLCOLOR:{const n=o.getField(t,Bo);q(!!n,`No buffer view for ${t}`),q(e.size===3||e.size===4),Yc(e,e.size,n,a);break}case T.COLORFEATUREATTRIBUTE:case T.OPACITYFEATUREATTRIBUTE:case T.SIZEFEATUREATTRIBUTE:{const n=o.getField(t,Zi)??o.getField(t,Zi);q(!!n,`No buffer view for ${t}`),q(e.size===1),Zc(e,n,a);break}case T.TANGENT:{q(e.size===4);const n=o.getField(t,Yi);q(!!n,`No buffer view for ${t}`),Xc(e,r,n,a);break}case T.PROFILEVERTEXANDNORMAL:{q(e.size===4);const n=o.getField(t,Jn)??o.getField(t,Yi);q(!!n,`No buffer view for ${t}`),Ia(e,n,a);break}case T.PROFILEAUXDATA:{q(e.size===3);const n=o.getField(t,Zn)??o.getField(t,fr);q(!!n,`No buffer view for ${t}`),$i(e,n,a);break}}}let ed=class{constructor(e){this.vertexBufferLayout=e}elementCount(e){return e.get(T.POSITION).indices.length}write(e,r,i,o,a,n){return Kc(i,o,this.vertexBufferLayout,e,r,a,n)}intersect(e,r,i,o,a,n,s){const l=this.vertexBufferLayout.createView(e).getField(T.POSITION,fr);if(l==null)return;const c=at(td,n,a),u=0,h=l.count/3,m=o.options.normalRequired,p=(v,x,_)=>{s(v,_,x)};Cc(a,c,u,h,l.typedBuffer,l.typedBufferStride,m,p)}};const td=C();let Na=class extends k{constructor(e,r){super(e,"mat4",S.Pass,(i,o,a)=>i.setUniformMatrix4fv(e,r(o,a)))}};function rd(t,e){const{attributes:r,vertex:i,varyings:o,fragment:a}=t;i.include(Vo,e),r.add(T.POSITION,"vec3"),o.add("vPositionWorldCameraRelative","vec3"),o.add("vPosition_view","vec3",{invariant:!0}),i.uniforms.add(new ae("transformWorldFromViewTH",n=>n.transformWorldFromViewTH),new ae("transformWorldFromViewTL",n=>n.transformWorldFromViewTL),new Fe("transformViewFromCameraRelativeRS",n=>n.transformViewFromCameraRelativeRS),new Na("transformProjFromView",n=>n.transformProjFromView),new Ho("transformWorldFromModelRS",n=>n.transformWorldFromModelRS),new be("transformWorldFromModelTH",n=>n.transformWorldFromModelTH),new be("transformWorldFromModelTL",n=>n.transformWorldFromModelTL)),i.code.add(d`vec3 positionWorldCameraRelative() {
vec3 rotatedModelPosition = transformWorldFromModelRS * position;
vec3 transform_CameraRelativeFromModel = dpAdd(
transformWorldFromModelTL,
transformWorldFromModelTH,
-transformWorldFromViewTL,
-transformWorldFromViewTH
);
return transform_CameraRelativeFromModel + rotatedModelPosition;
}`),i.code.add(d`
    void forwardPosition(float fOffset) {
      vPositionWorldCameraRelative = positionWorldCameraRelative();
      if (fOffset != 0.0) {
        vPositionWorldCameraRelative += fOffset * ${e.spherical?d`normalize(transformWorldFromViewTL + vPositionWorldCameraRelative)`:d`vec3(0.0, 0.0, 1.0)`};
      }

      vPosition_view = transformViewFromCameraRelativeRS * vPositionWorldCameraRelative;
      gl_Position = transformProjFromView * vec4(vPosition_view, 1.0);
    }
  `),a.uniforms.add(new ae("transformWorldFromViewTL",n=>n.transformWorldFromViewTL)),i.code.add(d`vec3 positionWorld() {
return transformWorldFromViewTL + vPositionWorldCameraRelative;
}`),a.code.add(d`vec3 positionWorld() {
return transformWorldFromViewTL + vPositionWorldCameraRelative;
}`)}let id=class extends ar{constructor(){super(...arguments),this.transformWorldFromViewTH=C(),this.transformWorldFromViewTL=C(),this.transformViewFromCameraRelativeRS=wi(),this.transformProjFromView=or()}};function $a(t,e){switch(e.normalType){case le.Attribute:case le.Compressed:t.include(Dr,e),t.varyings.add("vNormalWorld","vec3"),t.varyings.add("vNormalView","vec3"),t.vertex.uniforms.add(new Ho("transformNormalGlobalFromModel",r=>r.transformNormalGlobalFromModel),new Fe("transformNormalViewFromGlobal",r=>r.transformNormalViewFromGlobal)),t.vertex.code.add(d`void forwardNormal() {
vNormalWorld = transformNormalGlobalFromModel * normalModel();
vNormalView = transformNormalViewFromGlobal * vNormalWorld;
}`);break;case le.ScreenDerivative:t.vertex.code.add(d`void forwardNormal() {}`);break;default:xi(e.normalType);case le.COUNT:}}let od=class extends id{constructor(){super(...arguments),this.transformNormalViewFromGlobal=wi()}},Wr=class{constructor(e,r){this._module=e,this._load=r}get(){return this._module}async reload(){return this._module=await this._load(),this._module}},ho=class{constructor(e,r,i){this._context=e,this._locations=i,this._textures=new Map,this._glProgram=e.programCache.acquire(r.generate("vertex",!0),r.generate("fragment",!0),i),this._glProgram.stop=()=>{throw new Error("Wrapped _glProgram used directly")},this.bind=r.generateBind(this),this.bindPass=r.generateBindPass(this),this.bindDraw=r.generateBindDraw(this)}dispose(){this._glProgram.dispose()}get glName(){return this._glProgram.glName}get hasTransformFeedbackVaryings(){return this._glProgram.hasTransformFeedbackVaryings}get compiled(){return this._glProgram.compiled}setUniform1b(e,r){this._glProgram.setUniform1i(e,r?1:0)}setUniform1i(e,r){this._glProgram.setUniform1i(e,r)}setUniform1f(e,r){this._glProgram.setUniform1f(e,r)}setUniform2fv(e,r){this._glProgram.setUniform2fv(e,r)}setUniform3fv(e,r){this._glProgram.setUniform3fv(e,r)}setUniform4fv(e,r){this._glProgram.setUniform4fv(e,r)}setUniformMatrix3fv(e,r){this._glProgram.setUniformMatrix3fv(e,r)}setUniformMatrix4fv(e,r){this._glProgram.setUniformMatrix4fv(e,r)}setUniform1fv(e,r){this._glProgram.setUniform1fv(e,r)}setUniform1iv(e,r){this._glProgram.setUniform1iv(e,r)}setUniform2iv(e,r){this._glProgram.setUniform2iv(e,r)}setUniform3iv(e,r){this._glProgram.setUniform3iv(e,r)}setUniform4iv(e,r){this._glProgram.setUniform4iv(e,r)}assertCompatibleVertexAttributeLocations(e){e.locations!==this._locations&&console.error("VertexAttributeLocations are incompatible")}stop(){this._textures.clear()}bindTexture(e,r){r?.glName||(Wo()&&console.error(`Texture sampler ${e} has no given Texture in ${new Error().stack} `),r=this._context.emptyTexture);const i=this._ensureTextureUnit(e,r);this._context.useProgram(this),this.setUniform1i(e,i.unit),this._context.bindTexture(r,i.unit)}_ensureTextureUnit(e,r){let i=this._textures.get(e);return i==null?(i={texture:r,unit:this._textures.size},this._textures.set(e,i)):i.texture=r,i}};const ad=()=>dt.getLogger("esri.views.3d.webgl.ShaderTechnique");let Pi=class{constructor(e,r,i,o=ia){this.locations=o,this.primitiveType=jn.TRIANGLES,this.key=r.key,this._program=new ho(e.rctx,i.get().build(r),o),this._pipeline=this.initializePipeline(r),this.reload=async a=>{a&&await i.reload(),this.key.equals(r.key)||ad().warn("Configuration was changed after construction, cannot reload shader.",i),Sr(this._program),this._program=new ho(e.rctx,i.get().build(r),o),this._pipeline=this.initializePipeline(r)}}destroy(){this._program=Sr(this._program),this._pipeline=null}get program(){return this._program}get compiled(){return this.program.compiled}ensureAttributeLocations(e){this.program.assertCompatibleVertexAttributeLocations(e)}getPipeline(e,r){return this._pipeline}initializePipeline(e){return Hr({blending:ql,colorWrite:Vr})}};function nd(t,e){return cs(t)?{buffers:[kn.NONE]}:e??null}Le.LESS;Le.ALWAYS;const sd={mask:255},ld={function:{func:Le.ALWAYS,ref:Ze.OutlineVisualElementMask,mask:Ze.OutlineVisualElementMask},operation:{fail:Ee.KEEP,zFail:Ee.KEEP,zPass:Ee.ZERO}},cd={function:{func:Le.ALWAYS,ref:Ze.OutlineVisualElementMask,mask:Ze.OutlineVisualElementMask},operation:{fail:Ee.KEEP,zFail:Ee.KEEP,zPass:Ee.REPLACE}};Le.EQUAL,Ze.OutlineVisualElementMask,Ze.OutlineVisualElementMask,Ee.KEEP,Ee.KEEP,Ee.KEEP;Le.NOTEQUAL,Ze.OutlineVisualElementMask,Ze.OutlineVisualElementMask,Ee.KEEP,Ee.KEEP,Ee.KEEP;let jr=class extends k{constructor(e,r){super(e,"vec2",S.Bind,(i,o)=>i.setUniform2fv(e,r(o)))}};function mo(t){t.varyings.add("linearDepth","float",{invariant:!0})}function Pa(t){t.vertex.uniforms.add(new jr("nearFar",e=>e.camera.nearFar))}function Da(t){t.vertex.code.add(d`float calculateLinearDepth(vec2 nearFar,float z) {
return (-z - nearFar[0]) / (nearFar[1] - nearFar[0]);
}`)}function La(t,e){const{vertex:r}=t;switch(e.output){case j.Color:case j.ColorEmission:if(e.receiveShadows)return mo(t),void r.code.add(d`void forwardLinearDepth() { linearDepth = gl_Position.w; }`);break;case j.Shadow:case j.ShadowHighlight:case j.ShadowExcludeHighlight:case j.ViewshedShadow:return t.include(rd,e),mo(t),Pa(t),Da(t),void r.code.add(d`void forwardLinearDepth() {
linearDepth = calculateLinearDepth(nearFar, vPosition_view.z);
}`)}r.code.add(d`void forwardLinearDepth() {}`)}function Fa(t){t.vertex.code.add(d`vec4 offsetBackfacingClipPosition(vec4 posClip, vec3 posWorld, vec3 normalWorld, vec3 camPosWorld) {
vec3 camToVert = posWorld - camPosWorld;
bool isBackface = dot(camToVert, normalWorld) > 0.0;
if (isBackface) {
posClip.z += 0.0000003 * posClip.w;
}
return posClip;
}`)}function Et(t,e){ud(t,e,new be("slicePlaneOrigin",(r,i)=>Va(e,r,i)),new be("slicePlaneBasis1",(r,i)=>Ir(e,r,i,i.slicePlane?.basis1)),new be("slicePlaneBasis2",(r,i)=>Ir(e,r,i,i.slicePlane?.basis2)))}function sm(t,e){Ba(t,e,new be("slicePlaneOrigin",(r,i)=>Va(e,r,i)),new be("slicePlaneBasis1",(r,i)=>Ir(e,r,i,i.slicePlane?.basis1)),new be("slicePlaneBasis2",(r,i)=>Ir(e,r,i,i.slicePlane?.basis2)))}const dd=d`struct SliceFactors {
float front;
float side0;
float side1;
float side2;
float side3;
};
SliceFactors calculateSliceFactors(vec3 pos) {
vec3 rel = pos - slicePlaneOrigin;
vec3 slicePlaneNormal = -cross(slicePlaneBasis1, slicePlaneBasis2);
float slicePlaneW = -dot(slicePlaneNormal, slicePlaneOrigin);
float basis1Len2 = dot(slicePlaneBasis1, slicePlaneBasis1);
float basis2Len2 = dot(slicePlaneBasis2, slicePlaneBasis2);
float basis1Dot = dot(slicePlaneBasis1, rel);
float basis2Dot = dot(slicePlaneBasis2, rel);
return SliceFactors(
dot(slicePlaneNormal, pos) + slicePlaneW,
-basis1Dot - basis1Len2,
basis1Dot - basis1Len2,
-basis2Dot - basis2Len2,
basis2Dot - basis2Len2
);
}
bool sliceByFactors(SliceFactors factors) {
return factors.front < 0.0
&& factors.side0 < 0.0
&& factors.side1 < 0.0
&& factors.side2 < 0.0
&& factors.side3 < 0.0;
}
bool sliceEnabled() {
return dot(slicePlaneBasis1, slicePlaneBasis1) != 0.0;
}
bool sliceByPlane(vec3 pos) {
return sliceEnabled() && sliceByFactors(calculateSliceFactors(pos));
}
bool rejectBySlice(vec3 pos) {
return sliceByPlane(pos);
}`;function Ba(t,e,...r){e.hasSlicePlane?(t.uniforms.add(...r),t.code.add(dd)):t.code.add("bool rejectBySlice(vec3 pos) { return false; }")}function ud(t,e,...r){Ba(t,e,...r),e.hasSlicePlane?t.code.add(`
    void discardBySlice(vec3 pos) {
      if (sliceByPlane(pos)) {
        discard;
      }
    }

    vec4 applySliceOutline(vec4 color, vec3 pos) {
      SliceFactors factors = calculateSliceFactors(pos);

      factors.front /= 2.0 * fwidth(factors.front);
      factors.side0 /= 2.0 * fwidth(factors.side0);
      factors.side1 /= 2.0 * fwidth(factors.side1);
      factors.side2 /= 2.0 * fwidth(factors.side2);
      factors.side3 /= 2.0 * fwidth(factors.side3);

      // return after calling fwidth, to avoid aliasing caused by discontinuities in the input to fwidth
      if (sliceByFactors(factors)) {
        return color;
      }

      float outlineFactor = (1.0 - step(0.5, factors.front))
        * (1.0 - step(0.5, factors.side0))
        * (1.0 - step(0.5, factors.side1))
        * (1.0 - step(0.5, factors.side2))
        * (1.0 - step(0.5, factors.side3));

      return mix(color, vec4(vec3(0.0), color.a), outlineFactor * 0.3);
    }

    vec4 applySlice(vec4 color, vec3 pos) {
      return sliceEnabled() ? applySliceOutline(color, pos) : color;
    }
  `):t.code.add(d`void discardBySlice(vec3 pos) { }
vec4 applySlice(vec4 color, vec3 pos) { return color; }`)}function Ua(t,e,r){return t.instancedDoublePrecision?te(hd,r.camera.viewInverseTransposeMatrix[3],r.camera.viewInverseTransposeMatrix[7],r.camera.viewInverseTransposeMatrix[11]):e.slicePlaneLocalOrigin}function Ga(t,e){return t!=null?De(Nr,e.origin,t):e.origin}function za(t,e,r){return t.hasSliceTranslatedView?e!=null?ci(md,r.camera.viewMatrix,e):r.camera.viewMatrix:null}function Va(t,e,r){if(r.slicePlane==null)return Ct;const i=Ua(t,e,r),o=Ga(i,r.slicePlane),a=za(t,i,r);return a!=null?Ce(Nr,o,a):o}function Ir(t,e,r,i){if(i==null||r.slicePlane==null)return Ct;const o=Ua(t,e,r),a=Ga(o,r.slicePlane),n=za(t,o,r);return n!=null?(Ye(Dt,i,a),Ce(Nr,a,n),Ce(Dt,Dt,n),De(Dt,Dt,Nr)):i}const hd=C(),Nr=C(),Dt=C(),md=or();function bt(t){Da(t),t.vertex.code.add(d`vec4 transformPositionWithDepth(mat4 proj, mat4 view, vec3 pos, vec2 nearFar, out float depth) {
vec4 eye = view * vec4(pos, 1.0);
depth = calculateLinearDepth(nearFar,eye.z);
return proj * eye;
}`),t.vertex.code.add(d`vec4 transformPosition(mat4 proj, mat4 view, vec3 pos) {
return proj * (view * vec4(pos, 1.0));
}`)}let ct=class extends k{constructor(e,r){super(e,"vec3",S.Bind,(i,o)=>i.setUniform3fv(e,r(o)))}},pd=class extends k{constructor(e,r){super(e,"mat4",S.Draw,(i,o,a)=>i.setUniformMatrix4fv(e,r(o,a)))}};function Qt(t,e){e.instancedDoublePrecision?t.constants.add("cameraPosition","vec3",Ct):t.uniforms.add(new be("cameraPosition",(r,i)=>te(Ha,i.camera.viewInverseTransposeMatrix[3]-r.origin[0],i.camera.viewInverseTransposeMatrix[7]-r.origin[1],i.camera.viewInverseTransposeMatrix[11]-r.origin[2])))}function St(t,e){if(!e.instancedDoublePrecision)return void t.uniforms.add(new vr("proj",i=>i.camera.projectionMatrix),new pd("view",(i,o)=>ci(po,o.camera.viewMatrix,i.origin)),new be("localOrigin",i=>i.origin));const r=({camera:i})=>te(Ha,i.viewInverseTransposeMatrix[3],i.viewInverseTransposeMatrix[7],i.viewInverseTransposeMatrix[11]);t.uniforms.add(new vr("proj",i=>i.camera.projectionMatrix),new vr("view",i=>ci(po,i.camera.viewMatrix,r(i))),new ct("localOrigin",i=>r(i)))}const po=or(),Ha=C();function fd(t){t.uniforms.add(new vr("viewNormal",e=>e.camera.viewInverseTransposeMatrix))}function dm(t){t.uniforms.add(new Rt("pixelRatio",e=>e.camera.pixelRatio/e.overlayStretch))}function gd(t,e){const r=t.length;for(let i=0;i<r;++i)wt[0]=t[i],e[i]=wt[0];return e}function vd(t,e){const r=t.length;for(let i=0;i<r;++i)wt[0]=t[i],wt[1]=t[i]-wt[0],e[i]=wt[1];return e}const wt=new Float32Array(2),fo=wi();function Wa(t,e){const{hasModelTransformation:r,instancedDoublePrecision:i,instanced:o,output:a,hasVertexTangents:n}=e;r&&(t.vertex.uniforms.add(new Na("model",l=>l.modelTransformation??ro)),t.vertex.uniforms.add(new Fe("normalLocalOriginFromModel",l=>(xs(fo,l.modelTransformation??ro),fo)))),o&&i&&(t.attributes.add(T.INSTANCEMODELORIGINHI,"vec3"),t.attributes.add(T.INSTANCEMODELORIGINLO,"vec3"),t.attributes.add(T.INSTANCEMODEL,"mat3"),t.attributes.add(T.INSTANCEMODELNORMAL,"mat3"));const s=t.vertex;i&&(s.include(Vo,e),s.uniforms.add(new ct("viewOriginHi",l=>gd(te(pr,l.camera.viewInverseTransposeMatrix[3],l.camera.viewInverseTransposeMatrix[7],l.camera.viewInverseTransposeMatrix[11]),pr)),new ct("viewOriginLo",l=>vd(te(pr,l.camera.viewInverseTransposeMatrix[3],l.camera.viewInverseTransposeMatrix[7],l.camera.viewInverseTransposeMatrix[11]),pr)))),s.code.add(d`
    vec3 getVertexInLocalOriginSpace() {
      return ${r?i?"(model * vec4(instanceModel * localPosition().xyz, 1.0)).xyz":"(model * localPosition()).xyz":i?"instanceModel * localPosition().xyz":"localPosition().xyz"};
    }

    vec3 subtractOrigin(vec3 _pos) {
      ${i?d`
          // Issue: (should be resolved now with invariant position) https://devtopia.esri.com/WebGIS/arcgis-js-api/issues/56280
          vec3 originDelta = dpAdd(viewOriginHi, viewOriginLo, -instanceModelOriginHi, -instanceModelOriginLo);
          return _pos - originDelta;`:"return vpos;"}
    }
    `),s.code.add(d`
    vec3 dpNormal(vec4 _normal) {
      return normalize(${r?i?"normalLocalOriginFromModel * (instanceModelNormal * _normal.xyz)":"normalLocalOriginFromModel * _normal.xyz":i?"instanceModelNormal * _normal.xyz":"_normal.xyz"});
    }
    `),a===j.Normal&&(fd(s),s.code.add(d`
    vec3 dpNormalView(vec4 _normal) {
      return normalize((viewNormal * ${r?i?"vec4(normalLocalOriginFromModel * (instanceModelNormal * _normal.xyz), 1.0)":"vec4(normalLocalOriginFromModel * _normal.xyz, 1.0)":i?"vec4(instanceModelNormal * _normal.xyz, 1.0)":"_normal"}).xyz);
    }
    `)),n&&s.code.add(d`
    vec4 dpTransformVertexTangent(vec4 _tangent) {
      ${r?i?"return vec4(normalLocalOriginFromModel * (instanceModelNormal * _tangent.xyz), _tangent.w);":"return vec4(normalLocalOriginFromModel * _tangent.xyz, _tangent.w);":i?"return vec4(instanceModelNormal * _tangent.xyz, _tangent.w);":"return _tangent;"}
    }`)}const pr=C();let Td=class extends k{constructor(e,r){super(e,"int",S.Pass,(i,o,a)=>i.setUniform1i(e,r(o,a)))}};function ja(t,e){e.hasSymbolColors?(t.include(Es),t.attributes.add(T.SYMBOLCOLOR,"vec4"),t.varyings.add("colorMixMode","mediump float"),t.vertex.code.add(d`int symbolColorMixMode;
vec4 getSymbolColor() {
return decodeSymbolColor(symbolColor, symbolColorMixMode) * 0.003921568627451;
}
void forwardColorMixMode() {
colorMixMode = float(symbolColorMixMode) + 0.5;
}`)):(t.fragment.uniforms.add(new Td("colorMixMode",r=>jl[r.colorMixMode])),t.vertex.code.add(d`vec4 getSymbolColor() { return vec4(1.0); }
void forwardColorMixMode() {}`))}function ka(t,e){e.hasVertexColors?(t.attributes.add(T.COLOR,"vec4"),t.varyings.add("vColor","vec4"),t.vertex.code.add(d`void forwardVertexColor() { vColor = color; }`),t.vertex.code.add(d`void forwardNormalizedVertexColor() { vColor = color * 0.003921568627451; }`)):t.vertex.code.add(d`void forwardVertexColor() {}
void forwardNormalizedVertexColor() {}`)}function xd(t){t.vertex.code.add(d`float screenSizePerspectiveViewAngleDependentFactor(float absCosAngle) {
return absCosAngle * absCosAngle * absCosAngle;
}`),t.vertex.code.add(d`vec3 screenSizePerspectiveScaleFactor(float absCosAngle, float distanceToCamera, vec3 params) {
return vec3(
min(params.x / (distanceToCamera - params.y), 1.0),
screenSizePerspectiveViewAngleDependentFactor(absCosAngle),
params.z
);
}`),t.vertex.code.add(d`float applyScreenSizePerspectiveScaleFactorFloat(float size, vec3 factor) {
return mix(size * clamp(factor.x, factor.z, 1.0), size, factor.y);
}`),t.vertex.code.add(d`float screenSizePerspectiveScaleFloat(float size, float absCosAngle, float distanceToCamera, vec3 params) {
return applyScreenSizePerspectiveScaleFactorFloat(
size,
screenSizePerspectiveScaleFactor(absCosAngle, distanceToCamera, params)
);
}`),t.vertex.code.add(d`vec2 applyScreenSizePerspectiveScaleFactorVec2(vec2 size, vec3 factor) {
return mix(size * clamp(factor.x, factor.z, 1.0), size, factor.y);
}`),t.vertex.code.add(d`vec2 screenSizePerspectiveScaleVec2(vec2 size, float absCosAngle, float distanceToCamera, vec3 params) {
return applyScreenSizePerspectiveScaleFactorVec2(size, screenSizePerspectiveScaleFactor(absCosAngle, distanceToCamera, params));
}`)}function hm(t){t.uniforms.add(new ae("screenSizePerspective",e=>qa(e.screenSizePerspective)))}function _d(t){t.uniforms.add(new ae("screenSizePerspectiveAlignment",e=>qa(e.screenSizePerspectiveAlignment||e.screenSizePerspective)))}function qa(t){return te(Ed,t.parameters.divisor,t.parameters.offset,t.minScaleFactor)}const Ed=C();let kr=class extends k{constructor(e,r){super(e,"vec4",S.Pass,(i,o,a)=>i.setUniform4fv(e,r(o,a)))}};function Xa(t,e){const r=t.vertex;e.hasVerticalOffset?(Sd(r),e.hasScreenSizePerspective&&(t.include(xd),_d(r),Qt(t.vertex,e)),r.code.add(d`
      vec3 calculateVerticalOffset(vec3 worldPos, vec3 localOrigin) {
        float viewDistance = length((view * vec4(worldPos, 1.0)).xyz);
        ${e.spherical?d`vec3 worldNormal = normalize(worldPos + localOrigin);`:d`vec3 worldNormal = vec3(0.0, 0.0, 1.0);`}
        ${e.hasScreenSizePerspective?d`
            float cosAngle = dot(worldNormal, normalize(worldPos - cameraPosition));
            float verticalOffsetScreenHeight = screenSizePerspectiveScaleFloat(verticalOffset.x, abs(cosAngle), viewDistance, screenSizePerspectiveAlignment);`:d`
            float verticalOffsetScreenHeight = verticalOffset.x;`}
        // Screen sized offset in world space, used for example for line callouts
        float worldOffset = clamp(verticalOffsetScreenHeight * verticalOffset.y * viewDistance, verticalOffset.z, verticalOffset.w);
        return worldNormal * worldOffset;
      }

      vec3 addVerticalOffset(vec3 worldPos, vec3 localOrigin) {
        return worldPos + calculateVerticalOffset(worldPos, localOrigin);
      }
    `)):r.code.add(d`vec3 addVerticalOffset(vec3 worldPos, vec3 localOrigin) { return worldPos; }`)}const bd=Ei();function Sd(t){t.uniforms.add(new kr("verticalOffset",(e,r)=>{const{minWorldLength:i,maxWorldLength:o,screenLength:a}=e.verticalOffset,n=Math.tan(.5*r.camera.fovY)/(.5*r.camera.fullViewport[3]),s=r.camera.pixelRatio||1;return xe(bd,a*s,n,i,o)}))}function wd(t,e){if(e.output!==j.ObjectAndLayerIdColor)return t.vertex.code.add(d`void forwardObjectAndLayerIdColor() {}`),void t.fragment.code.add(d`void outputObjectAndLayerIdColor() {}`);const r=e.objectAndLayerIdColorInstanced;t.varyings.add("objectAndLayerIdColorVarying","vec4"),t.attributes.add(r?T.INSTANCEOBJECTANDLAYERIDCOLOR:T.OLIDCOLOR,"vec4"),t.vertex.code.add(d`
    void forwardObjectAndLayerIdColor() {
      objectAndLayerIdColorVarying = ${r?"instanceObjectAndLayerIdColor":"objectAndLayerIdColor"} * 0.003921568627451;
    }`),t.fragment.code.add(d`void outputObjectAndLayerIdColor() {
fragColor = objectAndLayerIdColorVarying;
}`)}function Md(t,e){switch(e.output){case j.Shadow:case j.ShadowHighlight:case j.ShadowExcludeHighlight:case j.ViewshedShadow:t.fragment.code.add(d`float _calculateFragDepth(const in float depth) {
const float SLOPE_SCALE = 2.0;
const float BIAS = 20.0 * .000015259;
float m = max(abs(dFdx(depth)), abs(dFdy(depth)));
return depth + SLOPE_SCALE * m + BIAS;
}
void outputDepth(float _linearDepth){
float fragDepth = _calculateFragDepth(_linearDepth);
gl_FragDepth = fragDepth;
}`)}}function Ad(t){const{fragment:e}=t;e.code.add(d`uint readChannelBits(uint channel, int highlightLevel) {
int llc = (highlightLevel & 3) << 1;
return (channel >> llc) & 3u;
}
uint readChannel(uvec2 texel, int highlightLevel) {
int lic = (highlightLevel >> 2) & 1;
return texel[lic];
}
uint readLevelBits(uvec2 texel, int highlightLevel) {
return readChannelBits(readChannel(texel, highlightLevel), highlightLevel);
}`)}let Rd=class extends k{constructor(e,r){super(e,"ivec2",S.Bind,(i,o)=>i.setUniform2iv(e,r(o)))}},Ya=class extends k{constructor(e,r){super(e,"int",S.Bind,(i,o)=>i.setUniform1i(e,r(o)))}},Di=class extends k{constructor(e,r){super(e,"sampler2D",S.Bind,(i,o)=>i.bindTexture(e,r(o)))}},yd=class extends k{constructor(e,r){super(e,"usampler2D",S.Bind,(i,o)=>i.bindTexture(e,r(o)))}};function Za(t,e){const{fragment:r}=t,{output:i,draped:o,hasHighlightMixTexture:a}=e;i===j.Highlight?(r.uniforms.add(new Ya("highlightLevel",n=>n.highlightLevel??0),new Rd("highlightMixOrigin",n=>n.highlightMixOrigin)),t.outputs.add("fragHighlight","uvec2",0),t.include(Ad),a?r.uniforms.add(new yd("highlightMixTexture",n=>n.highlightMixTexture)).code.add(d`uvec2 getAccumulatedHighlight() {
return texelFetch(highlightMixTexture, ivec2(gl_FragCoord.xy) - highlightMixOrigin, 0).rg;
}
void outputHighlight(bool occluded) {
if (highlightLevel == 0) {
uint bits = occluded ? 3u : 1u;
fragHighlight = uvec2(bits, 0);
} else {
int ll = (highlightLevel & 3) << 1;
int li = (highlightLevel >> 2) & 3;
uint bits;
if (occluded) {
bits = 3u << ll;
} else {
bits = 1u << ll;
}
uvec2 combinedHighlight = getAccumulatedHighlight();
combinedHighlight[li] |= bits;
fragHighlight = combinedHighlight;
}
}`):r.code.add(d`void outputHighlight(bool occluded) {
uint bits = occluded ? 3u : 1u;
fragHighlight = uvec2(bits, 0);
}`),o?r.code.add(d`bool isHighlightOccluded() {
return false;
}`):r.uniforms.add(new Di("depthTexture",n=>n.mainDepth)).code.add(d`bool isHighlightOccluded() {
float sceneDepth = texelFetch(depthTexture, ivec2(gl_FragCoord.xy), 0).x;
return gl_FragCoord.z > sceneDepth + 5e-7;
}`),r.code.add(d`void calculateOcclusionAndOutputHighlight() {
outputHighlight(isHighlightOccluded());
}`)):r.code.add(d`void calculateOcclusionAndOutputHighlight() {}`)}let Cd=class extends k{constructor(e,r,i){super(e,"vec4",S.Pass,(o,a,n)=>o.setUniform4fv(e,r(a,n)),i)}},Od=class extends k{constructor(e,r,i){super(e,"float",S.Pass,(o,a,n)=>o.setUniform1fv(e,r(a,n)),i)}};var go,vo;(function(t){t[t.Undefined=0]="Undefined",t[t.DefinedSize=1]="DefinedSize",t[t.DefinedScale=2]="DefinedScale"})(go||(go={})),function(t){t[t.Undefined=0]="Undefined",t[t.DefinedAngle=1]="DefinedAngle"}(vo||(vo={}));function _m(t,e,r){if(!e.vvSize)return te(t,1,1,1),t;if(Number.isNaN(r[0]))return oe(t,e.vvSize.fallback);for(let i=0;i<3;++i){const o=e.vvSize.offset[i]+r[0]*e.vvSize.factor[i];t[i]=_i(o,e.vvSize.minSize[i],e.vvSize.maxSize[i])}return t}const ai=8;function Yt(t,e){const{vertex:r,attributes:i}=t;e.hasVvInstancing&&(e.vvSize||e.vvColor)&&i.add(T.INSTANCEFEATUREATTRIBUTE,"vec4"),e.vvSize?(r.uniforms.add(new ae("vvSizeMinSize",o=>o.vvSize.minSize)),r.uniforms.add(new ae("vvSizeMaxSize",o=>o.vvSize.maxSize)),r.uniforms.add(new ae("vvSizeOffset",o=>o.vvSize.offset)),r.uniforms.add(new ae("vvSizeFactor",o=>o.vvSize.factor)),r.uniforms.add(new ae("vvSizeFallback",o=>o.vvSize.fallback)),r.uniforms.add(new Fe("vvSymbolRotationMatrix",o=>o.vvSymbolRotationMatrix)),r.uniforms.add(new ae("vvSymbolAnchor",o=>o.vvSymbolAnchor)),r.code.add(d`vec3 vvScale(vec4 _featureAttribute) {
if (isnan(_featureAttribute.x)) {
return vvSizeFallback;
}
return clamp(vvSizeOffset + _featureAttribute.x * vvSizeFactor, vvSizeMinSize, vvSizeMaxSize);
}
vec4 vvTransformPosition(vec3 position, vec4 _featureAttribute) {
return vec4(vvSymbolRotationMatrix * ( vvScale(_featureAttribute) * (position + vvSymbolAnchor)), 1.0);
}`),r.code.add(d`
      const float eps = 1.192092896e-07;
      vec4 vvTransformNormal(vec3 _normal, vec4 _featureAttribute) {
        vec3 scale = max(vvScale(_featureAttribute), eps);
        return vec4(vvSymbolRotationMatrix * _normal / scale, 1.0);
      }

      ${e.hasVvInstancing?d`
      vec4 vvLocalNormal(vec3 _normal) {
        return vvTransformNormal(_normal, instanceFeatureAttribute);
      }

      vec4 localPosition() {
        return vvTransformPosition(position, instanceFeatureAttribute);
      }`:""}
    `)):r.code.add(d`vec4 localPosition() { return vec4(position, 1.0); }
vec4 vvLocalNormal(vec3 _normal) { return vec4(_normal, 1.0); }`),e.vvColor?(r.constants.add("vvColorNumber","int",ai),r.uniforms.add(new Od("vvColorValues",o=>o.vvColor.values,ai),new Cd("vvColorColors",o=>o.vvColor.colors,ai),new kr("vvColorFallback",o=>o.vvColor.fallback)),r.code.add(d`
      vec4 interpolateVVColor(float value) {
        if (isnan(value)) {
          return vvColorFallback;
        }

        if (value <= vvColorValues[0]) {
          return vvColorColors[0];
        }

        for (int i = 1; i < vvColorNumber; ++i) {
          if (vvColorValues[i] >= value) {
            float f = (value - vvColorValues[i-1]) / (vvColorValues[i] - vvColorValues[i-1]);
            return mix(vvColorColors[i-1], vvColorColors[i], f);
          }
        }
        return vvColorColors[vvColorNumber - 1];
      }

      vec4 vvGetColor(vec4 featureAttribute) {
        return interpolateVVColor(featureAttribute.y);
      }

      ${e.hasVvInstancing?d`
            vec4 vvColor() {
              return vvGetColor(instanceFeatureAttribute);
            }`:"vec4 vvColor() { return vec4(1.0); }"}
    `)):r.code.add(d`vec4 vvColor() { return vec4(1.0); }`)}const It=1/255.5;function Mt(t,e){Id(t,e,new We("textureAlphaCutoff",r=>r.textureAlphaCutoff))}function Id(t,e,r){const i=t.fragment,o=e.alphaDiscardMode,a=o===ye.Blend;o!==ye.Mask&&o!==ye.MaskBlend||i.uniforms.add(r),i.code.add(d`
    void discardOrAdjustAlpha(inout vec4 color) {
      ${o===ye.Opaque?"color.a = 1.0;":`if (color.a < ${a?d.float(It):"textureAlphaCutoff"}) {
              discard;
             } ${$(o===ye.Mask,"else { color.a = 1.0; }")}`}
    }
  `)}function Ja(t,e){const{vertex:r,fragment:i,varyings:o}=t,{hasColorTexture:a,alphaDiscardMode:n}=e,s=a&&n!==ye.Opaque,{output:l,normalType:c,hasColorTextureTransform:u}=e;switch(l){case j.Depth:St(r,e),t.include(bt,e),i.include(Et,e),t.include(rt,e),s&&i.uniforms.add(new fe("tex",h=>h.texture)),r.main.add(d`vpos = getVertexInLocalOriginSpace();
vpos = subtractOrigin(vpos);
vpos = addVerticalOffset(vpos, localOrigin);
gl_Position = transformPosition(proj, view, vpos);
forwardTextureCoordinates();`),t.include(Mt,e),i.main.add(d`
        discardBySlice(vpos);
        ${$(s,d`vec4 texColor = texture(tex, ${u?"colorUV":"vuv0"});
                discardOrAdjustAlpha(texColor);`)}`);break;case j.Shadow:case j.ShadowHighlight:case j.ShadowExcludeHighlight:case j.ViewshedShadow:case j.ObjectAndLayerIdColor:St(r,e),t.include(bt,e),t.include(rt,e),t.include(Yt,e),t.include(Md,e),i.include(Et,e),t.include(wd,e),Pa(t),o.add("depth","float",{invariant:!0}),s&&i.uniforms.add(new fe("tex",h=>h.texture)),r.main.add(d`vpos = getVertexInLocalOriginSpace();
vpos = subtractOrigin(vpos);
vpos = addVerticalOffset(vpos, localOrigin);
gl_Position = transformPositionWithDepth(proj, view, vpos, nearFar, depth);
forwardTextureCoordinates();
forwardObjectAndLayerIdColor();`),t.include(Mt,e),i.main.add(d`
        discardBySlice(vpos);
        ${$(s,d`vec4 texColor = texture(tex, ${u?"colorUV":"vuv0"});
                discardOrAdjustAlpha(texColor);`)}
        ${l===j.ObjectAndLayerIdColor?d`outputObjectAndLayerIdColor();`:d`outputDepth(depth);`}`);break;case j.Normal:{St(r,e),t.include(bt,e),t.include(Dr,e),t.include($a,e),t.include(rt,e),t.include(Yt,e),s&&i.uniforms.add(new fe("tex",m=>m.texture)),c===le.ScreenDerivative&&o.add("vPositionView","vec3",{invariant:!0});const h=c===le.Attribute||c===le.Compressed;r.main.add(d`
        vpos = getVertexInLocalOriginSpace();
        ${h?d`vNormalWorld = dpNormalView(vvLocalNormal(normalModel()));`:d`vPositionView = (view * vec4(vpos, 1.0)).xyz;`}
        vpos = subtractOrigin(vpos);
        vpos = addVerticalOffset(vpos, localOrigin);
        gl_Position = transformPosition(proj, view, vpos);
        forwardTextureCoordinates();`),i.include(Et,e),t.include(Mt,e),i.main.add(d`
        discardBySlice(vpos);
        ${$(s,d`vec4 texColor = texture(tex, ${u?"colorUV":"vuv0"});
                discardOrAdjustAlpha(texColor);`)}

        ${c===le.ScreenDerivative?d`vec3 normal = screenDerivativeNormal(vPositionView);`:d`vec3 normal = normalize(vNormalWorld);
                    if (gl_FrontFacing == false){
                      normal = -normal;
                    }`}
        fragColor = vec4(0.5 + 0.5 * normal, 1.0);`);break}case j.Highlight:St(r,e),t.include(bt,e),t.include(rt,e),t.include(Yt,e),s&&i.uniforms.add(new fe("tex",h=>h.texture)),r.main.add(d`vpos = getVertexInLocalOriginSpace();
vpos = subtractOrigin(vpos);
vpos = addVerticalOffset(vpos, localOrigin);
gl_Position = transformPosition(proj, view, vpos);
forwardTextureCoordinates();`),i.include(Et,e),t.include(Mt,e),t.include(Za,e),i.main.add(d`
        discardBySlice(vpos);
        ${$(s,d`vec4 texColor = texture(tex, ${u?"colorUV":"vuv0"});
                discardOrAdjustAlpha(texColor);`)}
        calculateOcclusionAndOutputHighlight();`)}}let Ka=class extends k{constructor(e,r){super(e,"vec2",S.Pass,(i,o,a)=>i.setUniform2fv(e,r(o,a)))}};function Nd(t,e){const r=t.fragment,{hasVertexTangents:i,doubleSidedMode:o,hasNormalTexture:a,textureCoordinateType:n,bindType:s,hasNormalTextureTransform:l}=e;i?(t.attributes.add(T.TANGENT,"vec4"),t.varyings.add("vTangent","vec4"),o===ve.WindingOrder?r.code.add(d`mat3 computeTangentSpace(vec3 normal) {
float tangentHeadedness = gl_FrontFacing ? vTangent.w : -vTangent.w;
vec3 tangent = normalize(gl_FrontFacing ? vTangent.xyz : -vTangent.xyz);
vec3 bitangent = cross(normal, tangent) * tangentHeadedness;
return mat3(tangent, bitangent, normal);
}`):r.code.add(d`mat3 computeTangentSpace(vec3 normal) {
float tangentHeadedness = vTangent.w;
vec3 tangent = normalize(vTangent.xyz);
vec3 bitangent = cross(normal, tangent) * tangentHeadedness;
return mat3(tangent, bitangent, normal);
}`)):r.code.add(d`mat3 computeTangentSpace(vec3 normal, vec3 pos, vec2 st) {
vec3 Q1 = dFdx(pos);
vec3 Q2 = dFdy(pos);
vec2 stx = dFdx(st);
vec2 sty = dFdy(st);
float det = stx.t * sty.s - sty.t * stx.s;
vec3 T = stx.t * Q2 - sty.t * Q1;
T = T - normal * dot(normal, T);
T *= inversesqrt(max(dot(T,T), 1.e-10));
vec3 B = sign(det) * cross(normal, T);
return mat3(T, B, normal);
}`),a&&n!==ce.None&&(t.include(Ri,e),r.uniforms.add(s===S.Pass?new fe("normalTexture",c=>c.textureNormal):new Kt("normalTexture",c=>c.textureNormal)),l&&(r.uniforms.add(new Ka("scale",c=>c.scale??_s)),r.uniforms.add(new Fe("normalTextureTransformMatrix",c=>c.normalTextureTransformMatrix??Ot))),r.code.add(d`vec3 computeTextureNormal(mat3 tangentSpace, vec2 uv) {
vec3 rawNormal = textureLookup(normalTexture, uv).rgb * 2.0 - 1.0;`),l&&r.code.add(d`mat3 normalRotation = mat3(normalTextureTransformMatrix[0][0]/scale[0], normalTextureTransformMatrix[0][1]/scale[1], 0.0,
normalTextureTransformMatrix[1][0]/scale[0], normalTextureTransformMatrix[1][1]/scale[1], 0.0,
0.0, 0.0, 0.0 );
rawNormal.xy = (normalRotation * vec3(rawNormal.x, rawNormal.y, 1.0)).xy;`),r.code.add(d`return tangentSpace * rawNormal;
}`))}var gi,$r;(function(t){t.OPAQUE="opaque-color",t.TRANSPARENT="transparent-color",t.COMPOSITE="composite-color",t.FINAL="final-color"})(gi||(gi={})),function(t){t.SSAO="ssao",t.LASERLINES="laserline-color",t.ANTIALIASING="aa-color",t.HIGHLIGHTS="highlight-color",t.MAGNIFIER="magnifier-color",t.OCCLUDED="occluded-color",t.VIEWSHED="viewshed-color",t.OPAQUE_TERRAIN="opaque-terrain-color",t.OPAQUE_ENVIRONMENT="opaque-environment-color",t.TRANSPARENT_ENVIRONMENT="transparent-environment-color",t.FOCUSAREA="focusarea",t.FOCUSAREA_COLOR="focusarea-color"}($r||($r={}));let tt=class extends Oo{constructor(e){super(e),this.view=null,this.consumes={required:[]},this.produces=gi.COMPOSITE,this.requireGeometryDepth=!1,this._dirty=!0}initialize(){this.addHandles([Do(()=>this.view.ready,e=>{e&&this.view.stage?.renderer.addRenderNode(this)},Fn)])}destroy(){this.view.stage?.renderer?.removeRenderNode(this)}precompile(){}render(){throw new X("RenderNode:render-function-not-implemented","render() is not implemented.")}get camera(){return this.view.state.camera.clone()}get sunLight(){return this.bindParameters.lighting.legacy}get gl(){return this.view.stage.renderView.renderingContext.gl}get techniques(){return this.view.stage.renderView.techniques}acquireOutputFramebuffer(){const e=this._frameBuffer?.getTexture()?.descriptor,r=this.view.stage.renderer.fboCache.acquire(e?.width??640,e?.height??480,this.produces);return r.fbo?.initializeAndBind(),r}bindRenderTarget(){return this._frameBuffer?.fbo?.initializeAndBind(),this._frameBuffer}requestRender(e){e===ui.UPDATE&&this.view.stage?.renderView.requestRender(e),this._dirty=!0}resetWebGLState(){this.renderingContext.resetState(),this.renderingContext.bindFramebuffer(this._frameBuffer?.fbo)}get fboCache(){return this.view.stage.renderer.fboCache}get bindParameters(){return this.renderContext.bind}get renderingContext(){return this.view.stage.renderView.renderingContext}get renderContext(){return this.view.stage?.renderer.renderContext}updateAnimation(e){return!!this._dirty&&(this._dirty=!1,!0)}doRender(e){this._frameBuffer=e.find(({name:r})=>r===this.produces);try{return this.render(e)}finally{this._frameBuffer=null}}};f([W({constructOnly:!0})],tt.prototype,"view",void 0),f([W({constructOnly:!0})],tt.prototype,"consumes",void 0),f([W()],tt.prototype,"produces",void 0),f([W({readOnly:!0})],tt.prototype,"techniques",null),tt=f([Ti("esri.views.3d.webgl.RenderNode")],tt);var Y,yt;(function(t){t[t.R8UNORM=0]="R8UNORM",t[t.R8UINT=1]="R8UINT",t[t.RG8UNORM=2]="RG8UNORM",t[t.RG8UINT=3]="RG8UINT",t[t.RGBA4UNORM=4]="RGBA4UNORM",t[t.RGBA8UNORM=5]="RGBA8UNORM",t[t.RGBA8UNORM_MIPMAP=6]="RGBA8UNORM_MIPMAP",t[t.R16FLOAT=7]="R16FLOAT",t[t.RGBA16FLOAT=8]="RGBA16FLOAT",t[t.R32FLOAT=9]="R32FLOAT",t[t.COUNT=10]="COUNT"})(Y||(Y={})),function(t){t[t.DEPTH16=10]="DEPTH16",t[t.DEPTH24_STENCIL8=11]="DEPTH24_STENCIL8"}(yt||(yt={}));Y.R8UNORM+"",Y.R8UINT+"",Y.R16FLOAT+"",Y.R32FLOAT+"",Y.RG8UNORM+"",Y.RG8UINT+"",Y.RGBA8UNORM+"",Y.RGBA4UNORM+"",Y.RGBA8UNORM_MIPMAP+"",Y.RGBA16FLOAT+"",yt.DEPTH16+"",yt.DEPTH24_STENCIL8+"";const Tr=new ge;Tr.pixelFormat=U.RED,Tr.internalFormat=g.R8,Tr.wrapMode=de.CLAMP_TO_EDGE;const Gt=new ge;Gt.pixelFormat=U.RED_INTEGER,Gt.internalFormat=g.R8UI,Gt.wrapMode=de.CLAMP_TO_EDGE,Gt.samplingMode=B.NEAREST;const xr=new ge;xr.pixelFormat=U.RG,xr.internalFormat=g.RG8,xr.wrapMode=de.CLAMP_TO_EDGE;const zt=new ge;zt.pixelFormat=U.RG_INTEGER,zt.internalFormat=g.RG8UI,zt.wrapMode=de.CLAMP_TO_EDGE,zt.samplingMode=B.NEAREST;const _r=new ge;_r.internalFormat=g.RGBA4,_r.dataType=_e.UNSIGNED_SHORT_4_4_4_4,_r.wrapMode=de.CLAMP_TO_EDGE;const Qa=new ge;Qa.wrapMode=de.CLAMP_TO_EDGE;const Vt=new ge;Vt.wrapMode=de.CLAMP_TO_EDGE,Vt.samplingMode=B.LINEAR_MIPMAP_LINEAR,Vt.hasMipmap=!0,Vt.maxAnisotropy=8;const Ht=new ge;Ht.pixelFormat=U.RED,Ht.dataType=_e.HALF_FLOAT,Ht.internalFormat=g.R16F,Ht.samplingMode=B.NEAREST;const Er=new ge;Er.dataType=_e.HALF_FLOAT,Er.internalFormat=g.RGBA16F,Er.wrapMode=de.CLAMP_TO_EDGE;const Wt=new ge;Wt.pixelFormat=U.RED,Wt.dataType=_e.FLOAT,Wt.internalFormat=g.R32F,Wt.samplingMode=B.NEAREST;Y.R8UNORM+"",Y.R8UINT+"",Y.RG8UNORM+"",Y.RG8UINT+"",Y.RGBA4UNORM+"",Y.RGBA8UNORM+"",Y.RGBA8UNORM_MIPMAP+"",Y.R16FLOAT+"",Y.RGBA16FLOAT+"",Y.R32FLOAT+"",Y.COUNT+"";const $d={[He.DEPTH_COMPONENT16]:_e.UNSIGNED_SHORT,[He.DEPTH_COMPONENT24]:_e.UNSIGNED_INT,[He.DEPTH_COMPONENT32F]:_e.FLOAT,[st.DEPTH24_STENCIL8]:_e.UNSIGNED_INT_24_8,[st.DEPTH32F_STENCIL8]:_e.FLOAT_32_UNSIGNED_INT_24_8_REV};yt.DEPTH24_STENCIL8+"",To(st.DEPTH24_STENCIL8),yt.DEPTH16+"",To(He.DEPTH_COMPONENT16);function To(t){const e=new ge;return e.pixelFormat=Mi(t)?wr.DEPTH_COMPONENT:wr.DEPTH_STENCIL,e.dataType=$d[t],e.samplingMode=B.NEAREST,e.wrapMode=de.CLAMP_TO_EDGE,e.internalFormat=t,e.hasMipmap=!1,e.isImmutable=!0,e}const Pd=3e5,xo=5e5;function en(t,e=!0){t.attributes.add(T.POSITION,"vec2"),e&&t.varyings.add("uv","vec2"),t.vertex.main.add(d`
      gl_Position = vec4(position, 0.0, 1.0);
      ${e?d`uv = position * 0.5 + vec2(0.5);`:""}
  `)}function Li(t){t.uniforms.add(new jr("zProjectionMap",e=>Dd(e.camera))),t.code.add(d`float linearizeDepth(float depth) {
float depthNdc = depth * 2.0 - 1.0;
float c1 = zProjectionMap[0];
float c2 = zProjectionMap[1];
return -(c1 / (depthNdc + c2 + 1e-7));
}`),t.code.add(d`float depthFromTexture(sampler2D depthTexture, vec2 uv) {
ivec2 iuv = ivec2(uv * vec2(textureSize(depthTexture, 0)));
float depth = texelFetch(depthTexture, iuv, 0).r;
return depth;
}`),t.code.add(d`float linearDepthFromTexture(sampler2D depthTexture, vec2 uv) {
return linearizeDepth(depthFromTexture(depthTexture, uv));
}`)}function Dd(t){const e=t.projectionMatrix;return lt(Ld,e[14],e[10])}const Ld=Fr();let Fd=class extends k{constructor(e,r){super(e,"vec2",S.Draw,(i,o,a,n)=>i.setUniform2fv(e,r(o,a,n)))}};const Fi=()=>dt.getLogger("esri.views.3d.webgl-engine.core.shaderModules.shaderBuilder");let tn=class{constructor(){this._includedModules=new Map}include(e,r){this._includedModules.has(e)?this._includedModules.get(e):(this._includedModules.set(e,r),e(this.builder,r))}},qr=class extends tn{constructor(){super(...arguments),this.vertex=new _o,this.fragment=new _o,this.attributes=new zd,this.varyings=new Vd,this.extensions=new Hd,this.outputs=new Wd}get fragmentUniforms(){return this.fragment.uniforms.entries}get builder(){return this}generate(e,r=!1){const i=this.extensions.generateSource(e),o=this.attributes.generateSource(e),a=this.varyings.generateSource(e),n=e==="vertex"?this.vertex:this.fragment,s=n.uniforms.generateSource(),l=n.code.generateSource(),c=n.main.generateSource(r),u=e==="vertex"?qd:kd,h=n.constants.generateSource(),m=this.outputs.generateSource(e);return`#version 300 es
${i.join(`
`)}
${u}
${h.join(`
`)}
${s.join(`
`)}
${o.join(`
`)}
${a.join(`
`)}
${m.join(`
`)}
${l.join(`
`)}
${c.join(`
`)}`}generateBind(e){const r=new Map;this.vertex.uniforms.entries.forEach(a=>{const n=a.bind[S.Bind];n&&r.set(a.name,n)}),this.fragment.uniforms.entries.forEach(a=>{const n=a.bind[S.Bind];n&&r.set(a.name,n)});const i=Array.from(r.values()),o=i.length;return a=>{for(let n=0;n<o;++n)i[n](e,a)}}generateBindPass(e){const r=new Map;this.vertex.uniforms.entries.forEach(a=>{const n=a.bind[S.Pass];n&&r.set(a.name,n)}),this.fragment.uniforms.entries.forEach(a=>{const n=a.bind[S.Pass];n&&r.set(a.name,n)});const i=Array.from(r.values()),o=i.length;return(a,n)=>{for(let s=0;s<o;++s)i[s](e,a,n)}}generateBindDraw(e){const r=new Map;this.vertex.uniforms.entries.forEach(a=>{const n=a.bind[S.Draw];n&&r.set(a.name,n)}),this.fragment.uniforms.entries.forEach(a=>{const n=a.bind[S.Draw];n&&r.set(a.name,n)});const i=Array.from(r.values()),o=i.length;return(a,n,s)=>{for(let l=0;l<o;++l)i[l](e,s,a,n)}}},Bd=class{constructor(e){this._stage=e,this._entries=new Map}add(...e){for(const r of e)this._add(r);return this._stage}get(e){return this._entries.get(e)}_add(e){if(e!=null){if(this._entries.has(e.name)&&!this._entries.get(e.name).equals(e))throw new X("shaderbuilder:duplicate-uniform",`Duplicate uniform name ${e.name} for different uniform type`);this._entries.set(e.name,e)}else Fi().error(`Trying to add null Uniform from ${new Error().stack}.`)}generateSource(){return Array.from(this._entries.values()).map(({name:e,arraySize:r,type:i})=>r!=null?`uniform ${i} ${e}[${r}];`:`uniform ${i} ${e};`)}get entries(){return Array.from(this._entries.values())}},Ud=class{constructor(e){this._stage=e,this._bodies=new Array}add(e){return this._bodies.push(e),this._stage}generateSource(e){if(this._bodies.length>0)return[`void main() {
 ${this._bodies.join(`
`)||""} 
}`];if(e)throw new X("shaderbuilder:missing-main","Shader does not contain main function body.");return[]}},Gd=class{constructor(e){this._stage=e,this._entries=new Array}add(e){return this._entries.push(e),this._stage}generateSource(){return this._entries}},_o=class extends tn{constructor(){super(...arguments),this.uniforms=new Bd(this),this.main=new Ud(this),this.code=new Gd(this),this.constants=new jd(this)}get builder(){return this}},zd=class{constructor(){this._entries=new Array}add(e,r){this._entries.push([e,r])}generateSource(e){return e==="fragment"?[]:this._entries.map(r=>`in ${r[1]} ${r[0]};`)}},Vd=class{constructor(){this._entries=new Map}add(e,r,i){this._entries.has(e)?Fi().warn(`Ignoring duplicate varying ${r} ${e}`):this._entries.set(e,{type:r,invariant:i?.invariant??!1})}generateSource(e){const r=new Array;return this._entries.forEach((i,o)=>r.push((i.invariant&&e==="vertex"?"invariant ":"")+(e==="vertex"?"out":"in")+` ${i.type} ${o};`)),r}};var qe;let Hd=(qe=class{constructor(){this._entries=new Set}add(e){this._entries.add(e)}generateSource(e){const r=e==="vertex"?qe.ALLOWLIST_VERTEX:qe.ALLOWLIST_FRAGMENT;return Array.from(this._entries).filter(i=>r.includes(i)).map(i=>`#extension ${i} : enable`)}},qe.ALLOWLIST_FRAGMENT=["GL_EXT_shader_texture_lod","GL_OES_standard_derivatives"],qe.ALLOWLIST_VERTEX=[],qe);var Xe;let Wd=(Xe=class{constructor(){this._entries=new Map}add(e,r,i=0){const o=this._entries.get(i);o?.name!==e||o?.type!==r?this._entries.set(i,{name:e,type:r}):Fi().warn(`Fragment shader output location ${i} occupied`)}generateSource(e){if(e==="vertex")return[];this._entries.size===0&&this._entries.set(0,{name:Xe.DEFAULT_NAME,type:Xe.DEFAULT_TYPE});const r=new Array;return this._entries.forEach((i,o)=>r.push(`layout(location = ${o}) out ${i.type} ${i.name};`)),r}},Xe.DEFAULT_TYPE="vec4",Xe.DEFAULT_NAME="fragColor",Xe),jd=class G{constructor(e){this._stage=e,this._entries=new Set}add(e,r,i){let o="ERROR_CONSTRUCTOR_STRING";switch(r){case"float":o=G._numberToFloatStr(i);break;case"int":o=G._numberToIntStr(i);break;case"bool":o=i.toString();break;case"vec2":o=`vec2(${G._numberToFloatStr(i[0])},                            ${G._numberToFloatStr(i[1])})`;break;case"vec3":o=`vec3(${G._numberToFloatStr(i[0])},                            ${G._numberToFloatStr(i[1])},                            ${G._numberToFloatStr(i[2])})`;break;case"vec4":o=`vec4(${G._numberToFloatStr(i[0])},                            ${G._numberToFloatStr(i[1])},                            ${G._numberToFloatStr(i[2])},                            ${G._numberToFloatStr(i[3])})`;break;case"ivec2":o=`ivec2(${G._numberToIntStr(i[0])},                             ${G._numberToIntStr(i[1])})`;break;case"ivec3":o=`ivec3(${G._numberToIntStr(i[0])},                             ${G._numberToIntStr(i[1])},                             ${G._numberToIntStr(i[2])})`;break;case"ivec4":o=`ivec4(${G._numberToIntStr(i[0])},                             ${G._numberToIntStr(i[1])},                             ${G._numberToIntStr(i[2])},                             ${G._numberToIntStr(i[3])})`;break;case"uvec2":o=`uvec2(${G._numberToIntStr(i[0])},                             ${G._numberToIntStr(i[1])})`;break;case"uvec3":o=`uvec3(${G._numberToIntStr(i[0])},                             ${G._numberToIntStr(i[1])},                             ${G._numberToIntStr(i[2])})`;break;case"uvec4":o=`uvec4(${G._numberToIntStr(i[0])},                             ${G._numberToIntStr(i[1])},                             ${G._numberToIntStr(i[2])},                             ${G._numberToIntStr(i[3])})`;break;case"mat2":case"mat3":case"mat4":o=`${r}(${Array.prototype.map.call(i,a=>G._numberToFloatStr(a)).join(", ")})`}return this._entries.add(`const ${r} ${e} = ${o};`),this._stage}static _numberToIntStr(e){return e.toFixed(0)}static _numberToFloatStr(e){return Number.isInteger(e)?e.toFixed(1):e.toString()}generateSource(){return Array.from(this._entries)}};const kd=`#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  precision highp int;
  precision highp sampler2D;
  precision highp usampler2D;
  precision highp sampler2DArray;
  precision highp sampler2DShadow;
#else
  precision mediump float;
  precision mediump int;
  precision mediump sampler2D;
  precision mediump usampler2D;
  precision mediump sampler2DArray;
  precision mediump sampler2DShadow;
#endif`,qd=`precision highp float;
 precision highp sampler2D;
 precision highp usampler2D;
 precision highp sampler2DArray;
 precision highp sampler2DShadow;


 invariant gl_Position;
 `,ni=4;function Xd(){const t=new qr,e=t.fragment;t.include(en);const r=(ni+1)/2,i=1/(2*r*r);return e.include(Li),e.uniforms.add(new fe("depthMap",o=>o.depthTexture),new Kt("tex",o=>o.colorTexture),new Fd("blurSize",o=>o.blurSize),new We("projScale",(o,a)=>{const n=a.camera.distance;return n>5e4?Math.max(0,o.projScale-(n-5e4)):o.projScale})),e.code.add(d`
    void blurFunction(vec2 uv, float r, float center_d, float sharpness, inout float wTotal, inout float bTotal) {
      float c = texture(tex, uv).r;
      float d = linearDepthFromTexture(depthMap, uv);

      float ddiff = d - center_d;

      float w = exp(-r * r * ${d.float(i)} - ddiff * ddiff * sharpness);
      wTotal += w;
      bTotal += w * c;
    }
  `),t.outputs.add("fragBlur","float"),e.main.add(d`
    float b = 0.0;
    float w_total = 0.0;

    float center_d = linearDepthFromTexture(depthMap, uv);

    float sharpness = -0.05 * projScale / center_d;
    for (int r = -${d.int(ni)}; r <= ${d.int(ni)}; ++r) {
      float rf = float(r);
      vec2 uvOffset = uv + rf * blurSize;
      blurFunction(uvOffset, rf, center_d, sharpness, w_total, b);
    }
    fragBlur = b / w_total;`),t}const Yd=Object.freeze(Object.defineProperty({__proto__:null,build:Xd},Symbol.toStringTag,{value:"Module"}));let Eo=class extends Pi{constructor(e,r){super(e,r,new Wr(Yd,()=>tr(()=>import("./SSAOBlur.glsl-f65ea950.js"),["assets/SSAOBlur.glsl-f65ea950.js","assets/NormalAttribute.glsl-c8a94bd0.js","assets/index-f00bd99f.js","assets/index-a5714ce2.css","assets/VertexAttribute-123db042.js","assets/vec2-c0ea4c96.js","assets/vec2f64-44b9a02c.js","assets/videoUtils-7880a0f1.js","assets/basicInterfaces-cbf2757f.js","assets/TextureFormat-60b88abd.js","assets/enums-ff43618c.js","assets/BufferView-920eb48c.js","assets/vec32-6757f7c3.js","assets/sphere-47db6b49.js","assets/mat3-cd249fcd.js","assets/mat3f64-d34bdb1e.js","assets/vectorStacks-5954743a.js","assets/mat4f64-a3dc1405.js","assets/quatf64-216ddd5a.js","assets/lineSegment-eb444802.js","assets/orientedBoundingBox-b5a2f26d.js","assets/quat-b2e4eef3.js","assets/spatialReferenceEllipsoidUtils-eb97be5b.js","assets/computeTranslationToOriginAndRotation-40e271f0.js","assets/plane-d072a060.js","assets/InterleavedLayout-9da534c5.js","assets/types-d99602e0.js"])))}initializePipeline(){return Hr({colorWrite:Vr})}};const Zd="eXKEvZaUc66cjIKElE1jlJ6MjJ6Ufkl+jn2fcXp5jBx7c6KEflSGiXuXeW6OWs+tfqZ2Yot2Y7Zzfo2BhniEj3xoiXuXj4eGZpqEaHKDWjSMe7palFlzc3BziYOGlFVzg6Zzg7CUY5JrjFF7eYJ4jIKEcyyEonSXe7qUfqZ7j3xofqZ2c4R5lFZ5Y0WUbppoe1l2cIh2ezyUho+BcHN2cG6DbpqJhqp2e1GcezhrdldzjFGUcyxjc3aRjDyEc1h7Sl17c6aMjH92pb6Mjpd4dnqBjMOEhqZleIOBYzB7gYx+fnqGjJuEkWlwnCx7fGl+c4hjfGyRe5qMlNOMfnqGhIWHc6OMi4GDc6aMfqZuc6aMzqJzlKZ+lJ6Me3qRfoFue0WUhoR5UraEa6qMkXiPjMOMlJOGe7JrUqKMjK6MeYRzdod+Sl17boiPc6qEeYBlcIh2c1WEe7GDiWCDa0WMjEmMdod+Y0WcdntzhmN8WjyMjKJjiXtzgYxYaGd+a89zlEV7e2GJfnd+lF1rcK5zc4p5cHuBhL6EcXp5eYB7fnh8iX6HjIKEeaxuiYOGc66RfG2Ja5hzjlGMjEmMe9OEgXuPfHyGhPeEdl6JY02McGuMfnqGhFiMa3WJfnx2l4hwcG1uhmN8c0WMc39og1GBbrCEjE2EZY+JcIh2cIuGhIWHe0mEhIVrc09+gY5+eYBlnCyMhGCDl3drfmmMgX15aGd+gYx+fnuRfnhzY1SMsluJfnd+hm98WtNrcIuGh4SEj0qPdkqOjFF7jNNjdnqBgaqUjMt7boeBhnZ4jDR7c5pze4GGjEFrhLqMjHyMc0mUhKZze4WEa117kWlwbpqJjHZ2eX2Bc09zeId+e0V7WlF7jHJ2l72BfId8l3eBgXyBe897jGl7c66cgW+Xc76EjKNbgaSEjGx4fId8jFFjgZB8cG6DhlFziZhrcIh2fH6HgUqBgXiPY8dahGFzjEmMhEFre2dxhoBzc5SGfleGe6alc7aUeYBlhKqUdlp+cH5za4OEczxza0Gcc4J2jHZ5iXuXjH2Jh5yRjH2JcFx+hImBjH+MpddCl3dreZeJjIt8ZW18bm1zjoSEeIOBlF9oh3N7hlqBY4+UeYFwhLJjeYFwaGd+gUqBYxiEYot2fqZ2ondzhL6EYyiEY02Ea0VjgZB8doaGjHxoc66cjEGEiXuXiXWMiZhreHx8frGMe75rY02Ec5pzfnhzlEp4a3VzjM+EhFFza3mUY7Zza1V5e2iMfGyRcziEhDyEkXZ2Y4OBnCx7g5t2eyBjgV6EhEFrcIh2dod+c4Z+nJ5zjm15jEmUeYxijJp7nL6clIpjhoR5WrZraGd+fnuRa6pzlIiMg6ZzfHx5foh+eX1ufnB5eX1ufnB5aJt7UqKMjIh+e3aBfm5lbYSBhGFze6J4c39oc0mUc4Z+e0V7fKFVe0WEdoaGY02Ec4Z+Y02EZYWBfH6HgU1+gY5+hIWUgW+XjJ57ebWRhFVScHuBfJ6PhBx7WqJzlM+Ujpd4gHZziX6HjHmEgZN+lJt5boiPe2GJgX+GjIGJgHZzeaxufnB5hF2JtdN7jJ57hp57hK6ElFVzg6ZzbmiEbndzhIWHe3uJfoFue3qRhJd2j3xoc65zlE1jc3p8lE1jhniEgXJ7e657vZaUc3qBh52BhIF4aHKDa9drgY5+c52GWqZzbpqJe8tjnM+UhIeMfo2BfGl+hG1zSmmMjKJjZVaGgX15c1lze0mEp4OHa3mUhIWHhDyclJ6MeYOJkXiPc0VzhFiMlKaEboSJa5Jze41re3qRhn+HZYWBe0mEc4p5fnORbox5lEp4hGFjhGGEjJuEc1WEhLZjeHeGa7KlfHx2hLaMeX1ugY5+hIWHhKGPjMN7c1WEho1zhoBzZYx7fnhzlJt5exyUhFFziXtzfmmMa6qMYyiEiXxweV12kZSMeWqXSl17fnhzxmmMrVGEe1mcc4p5eHeGjK6MgY5+doaGa6pzlGV7g1qBh4KHkXiPeW6OaKqafqZ2eXZ5e1V7jGd7boSJc3BzhJd2e0mcYot2h1RoY8dahK6EQmWEWjx7e1l2lL6UgXyBdnR4eU9zc0VreX1umqaBhld7fo2Bc6KEc5Z+hDyEcIeBWtNrfHyGe5qMhMuMe5qMhEGEbVVupcNzg3aHhIF4boeBe0mEdlptc39ofFl5Y8uUlJOGiYt2UmGEcyxjjGx4jFF7a657ZYWBnElzhp57iXtrgZN+tfOEhIOBjE2HgU1+e8tjjKNbiWCDhE15gUqBgYN7fnqGc66ce9d7iYSBj0qPcG6DnGGcT3eGa6qMZY+JlIiMl4hwc3aRdnqBlGV7eHJ2hLZjfnuRhDyEeX6MSk17g6Z+c6aUjHmEhIF4gXyBc76EZW18fGl+fkl+jCxrhoVwhDyUhIqGlL2DlI6EhJd2tdN7eYORhEGMa2Faa6pzc3Bzc4R5lIRznM+UY9eMhDycc5Z+c4p5c4iGY117pb6MgXuPrbJafnx2eYOJeXZ5e657hDyEcziElKZjfoB5eHeGj4WRhGGEe6KGeX1utTStc76EhFGJnCyMa5hzfH6HnNeceYB7hmN8gYuMhIVrczSMgYF8h3N7c5pza5hzjJqEYIRdgYuMlL2DeYRzhGGEeX1uhLaEc4iGeZ1zdl6JhrVteX6Me2iMfm5lWqJzSpqEa6pzdnmchHx2c6OMhNdrhoR5g3aHczxzeW52gV6Ejm15frGMc0Vzc4Z+l3drfniJe+9rWq5rlF1rhGGEhoVwe9OEfoh+e7pac09+c3qBY0lrhDycdnp2lJ6MiYOGhGCDc3aRlL2DlJt5doaGdnp2gYF8gWeOjF2Uc4R5c5Z+jEmMe7KEc4mEeYJ4dmyBe0mcgXiPbqJ7eYB7fmGGiYSJjICGlF1reZ2PnElzbpqJfH6Hc39oe4WEc5eJhK6EhqyJc3qBgZB8c09+hEmEaHKDhFGJc5SGiXWMUpaEa89zc6OMnCyMiXtrho+Be5qMc7KEjJ57dmN+hKGPjICGbmiEe7prdod+hGCDdnmchBx7eX6MkXZ2hGGEa657hm98jFFjY5JreYOJgY2EjHZ2a295Y3FajJ6Mc1J+YzB7e4WBjF2Uc4R5eV12gYxzg1qBeId+c9OUc5pzjFFjgY5+hFiMlIaPhoR5lIpjjIKBlNdSe7KEeX2BfrGMhIqGc65zjE2UhK6EklZ+QmWEeziMWqZza3VzdnR4foh+gYF8n3iJiZhrnKp7gYF8eId+lJ6Me1lrcIuGjKJjhmN8c66MjFF7a6prjJ6UnJ5zezyUfruRWlF7nI5zfHyGe657h4SEe8tjhBx7jFFjc09+c39ojICMeZeJeXt+YzRzjHZ2c0WEcIeBeXZ5onSXkVR+gYJ+eYFwdldzgYF7eX2BjJ6UiXuXlE1jh4SEe1mchLJjc4Z+hqZ7eXZ5bm1zlL6Ue5p7iWeGhKqUY5pzjKJjcIeBe8t7gXyBYIRdlEp4a3mGnK6EfmmMZpqEfFl5gYxzjKZuhGFjhoKGhHx2fnx2eXuMe3aBiWeGvbKMe6KGa5hzYzB7gZOBlGV7hmN8hqZlYot2Y117a6pzc6KEfId8foB5rctrfneJfJ6PcHN2hFiMc5pzjH92c0VzgY2EcElzdmCBlFVzg1GBc65zY4OBboeBcHiBeYJ4ewxzfHx5lIRzlEmEnLKEbk1zfJ6PhmN8eYBljBiEnMOEiXxwezyUcIeBe76EdsKEeX2BdnR4jGWUrXWMjGd7fkl+j4WRlEGMa5Jzho+BhDyEfnqMeXt+g3aHlE1jczClhNN7ZW18eHx8hGFjZW18iXWMjKJjhH57gYuMcIuGWjyMe4ZtjJuExmmMj4WRdntzi4GDhFFzYIRdnGGcjJp7Y0F7e4WEkbCGiX57fnSHa657a6prhBCMe3Z+SmmMjH92eHJ2hK6EY1FzexhrvbKMnI5za4OEfnd+eXuMhImBe897hLaMjN+EfG+BeIOBhF1+eZeJi4GDkXZ2eXKEgZ6Ejpd4c2GHa1V5e5KUfqZuhCx7jKp7lLZrg11+hHx2hFWUoot2nI5zgbh5mo9zvZaUe3qRbqKMfqZ2kbCGhFiM";let Jd=class extends ar{constructor(){super(...arguments),this.projScale=1}},Kd=class extends Jd{constructor(){super(...arguments),this.intensity=1}},Qd=class extends ar{},eu=class extends Qd{constructor(){super(...arguments),this.blurSize=Fr()}},Re=class extends k{constructor(e,r){super(e,"vec4",S.Bind,(i,o)=>i.setUniform4fv(e,r(o)))}};function tu(t){t.fragment.uniforms.add(new Re("projInfo",e=>ru(e.camera))),t.fragment.uniforms.add(new jr("zScale",e=>iu(e.camera))),t.fragment.code.add(d`vec3 reconstructPosition(vec2 fragCoord, float depth) {
return vec3((fragCoord * projInfo.xy + projInfo.zw) * (zScale.x * depth + zScale.y), depth);
}`)}function ru(t){const e=t.projectionMatrix;return e[11]===0?xe(bo,2/(t.fullWidth*e[0]),2/(t.fullHeight*e[5]),(1+e[12])/e[0],(1+e[13])/e[5]):xe(bo,-2/(t.fullWidth*e[0]),-2/(t.fullHeight*e[5]),(1-e[8])/e[0],(1-e[9])/e[5])}const bo=Ei();function iu(t){return t.projectionMatrix[11]===0?lt(So,0,1):lt(So,1,0)}const So=Fr(),wo=16;function ou(){const t=new qr,e=t.fragment;return t.include(en),t.include(tu),e.include(Li),e.uniforms.add(new Rt("radius",r=>Bi(r.camera))).code.add(d`vec3 sphere[16] = vec3[16](
vec3(0.186937, 0.0, 0.0),
vec3(0.700542, 0.0, 0.0),
vec3(-0.864858, -0.481795, -0.111713),
vec3(-0.624773, 0.102853, -0.730153),
vec3(-0.387172, 0.260319, 0.007229),
vec3(-0.222367, -0.642631, -0.707697),
vec3(-0.01336, -0.014956, 0.169662),
vec3(0.122575, 0.1544, -0.456944),
vec3(-0.177141, 0.85997, -0.42346),
vec3(-0.131631, 0.814545, 0.524355),
vec3(-0.779469, 0.007991, 0.624833),
vec3(0.308092, 0.209288,0.35969),
vec3(0.359331, -0.184533, -0.377458),
vec3(0.192633, -0.482999, -0.065284),
vec3(0.233538, 0.293706, -0.055139),
vec3(0.417709, -0.386701, 0.442449)
);
float fallOffFunction(float vv, float vn, float bias) {
float f = max(radius * radius - vv, 0.0);
return f * f * f * max(vn - bias, 0.0);
}`),e.code.add(d`float aoValueFromPositionsAndNormal(vec3 C, vec3 n_C, vec3 Q) {
vec3 v = Q - C;
float vv = dot(v, v);
float vn = dot(normalize(v), n_C);
return fallOffFunction(vv, vn, 0.1);
}`),t.outputs.add("fragOcclusion","float"),e.uniforms.add(new fe("normalMap",r=>r.normalTexture),new fe("depthMap",r=>r.depthTexture),new We("projScale",r=>r.projScale),new fe("rnm",r=>r.noiseTexture),new Ka("rnmScale",(r,i)=>lt(Mo,i.camera.fullWidth/r.noiseTexture.descriptor.width,i.camera.fullHeight/r.noiseTexture.descriptor.height)),new We("intensity",r=>r.intensity),new jr("screenSize",r=>lt(Mo,r.camera.fullWidth,r.camera.fullHeight))).main.add(d`
    float depth = depthFromTexture(depthMap, uv);

    // Early out if depth is out of range, such as in the sky
    if (depth >= 1.0 || depth <= 0.0) {
      fragOcclusion = 1.0;
      return;
    }

    // get the normal of current fragment
    ivec2 iuv = ivec2(uv * vec2(textureSize(normalMap, 0)));
    vec4 norm4 = texelFetch(normalMap, iuv, 0);
    if(norm4.a != 1.0) {
      fragOcclusion = 1.0;
      return;
    }
    vec3 norm = normalize(norm4.xyz * 2.0 - 1.0);

    float currentPixelDepth = linearizeDepth(depth);
    vec3 currentPixelPos = reconstructPosition(gl_FragCoord.xy, currentPixelDepth);

    float sum = 0.0;
    vec3 tapPixelPos;

    vec3 fres = normalize(2.0 * texture(rnm, uv * rnmScale).xyz - 1.0);

    // note: the factor 2.0 should not be necessary, but makes ssao much nicer.
    // bug or deviation from CE somewhere else?
    float ps = projScale / (2.0 * currentPixelPos.z * zScale.x + zScale.y);

    for(int i = 0; i < ${d.int(wo)}; ++i) {
      vec2 unitOffset = reflect(sphere[i], fres).xy;
      vec2 offset = vec2(-unitOffset * radius * ps);

      // don't use current or very nearby samples
      if( abs(offset.x) < 2.0 || abs(offset.y) < 2.0){
        continue;
      }

      vec2 tc = vec2(gl_FragCoord.xy + offset);
      if (tc.x < 0.0 || tc.y < 0.0 || tc.x > screenSize.x || tc.y > screenSize.y) continue;
      vec2 tcTap = tc / screenSize;
      float occluderFragmentDepth = linearDepthFromTexture(depthMap, tcTap);

      tapPixelPos = reconstructPosition(tc, occluderFragmentDepth);

      sum += aoValueFromPositionsAndNormal(currentPixelPos, norm, tapPixelPos);
    }

    // output the result
    float A = max(1.0 - sum * intensity / float(${d.int(wo)}), 0.0);

    // Anti-tone map to reduce contrast and drag dark region farther: (x^0.2 + 1.2 * x^4) / 2.2
    A = (pow(A, 0.2) + 1.2 * A * A * A * A) / 2.2;

    fragOcclusion = A;
  `),t}function Bi(t){return Math.max(10,20*t.computeScreenPixelSizeAtDist(Math.abs(4*t.relativeElevation)))}const Mo=Fr(),au=Object.freeze(Object.defineProperty({__proto__:null,build:ou,getRadius:Bi},Symbol.toStringTag,{value:"Module"}));let Ao=class extends Pi{constructor(e,r){super(e,r,new Wr(au,()=>tr(()=>import("./SSAO.glsl-38c643f8.js"),["assets/SSAO.glsl-38c643f8.js","assets/vec2-c0ea4c96.js","assets/index-f00bd99f.js","assets/index-a5714ce2.css","assets/vec2f64-44b9a02c.js","assets/NormalAttribute.glsl-c8a94bd0.js","assets/VertexAttribute-123db042.js","assets/videoUtils-7880a0f1.js","assets/basicInterfaces-cbf2757f.js","assets/TextureFormat-60b88abd.js","assets/enums-ff43618c.js","assets/BufferView-920eb48c.js","assets/vec32-6757f7c3.js","assets/sphere-47db6b49.js","assets/mat3-cd249fcd.js","assets/mat3f64-d34bdb1e.js","assets/vectorStacks-5954743a.js","assets/mat4f64-a3dc1405.js","assets/quatf64-216ddd5a.js","assets/lineSegment-eb444802.js","assets/orientedBoundingBox-b5a2f26d.js","assets/quat-b2e4eef3.js","assets/spatialReferenceEllipsoidUtils-eb97be5b.js","assets/computeTranslationToOriginAndRotation-40e271f0.js","assets/plane-d072a060.js","assets/InterleavedLayout-9da534c5.js","assets/types-d99602e0.js"])))}initializePipeline(){return Hr({colorWrite:Vr})}};const jt=2;let Lt=class extends tt{constructor(t){super(t),this.consumes={required:["normals"]},this.produces=$r.SSAO,this.isEnabled=()=>!1,this._enableTime=lr(0),this._passParameters=new Kd,this._drawParameters=new eu}initialize(){const t=Uint8Array.from(atob(Zd),r=>r.charCodeAt(0)),e=new ge;e.wrapMode=de.CLAMP_TO_EDGE,e.pixelFormat=U.RGB,e.wrapMode=de.REPEAT,e.hasMipmap=!0,e.width=32,e.height=32,this._passParameters.noiseTexture=new At(this.renderingContext,e,t),this.techniques.precompile(Ao),this.techniques.precompile(Eo),this.addHandles(Do(()=>this.isEnabled(),()=>this._enableTime=lr(0)))}destroy(){this._passParameters.noiseTexture=Sr(this._passParameters.noiseTexture)}render(t){const e=t.find(({name:z})=>z==="normals"),r=e?.getTexture(),i=e?.getTexture(qn);if(!r||!i)return;const o=this.techniques.get(Ao),a=this.techniques.get(Eo);if(!o.compiled||!a.compiled)return this._enableTime=lr(performance.now()),void this.requestRender(ui.UPDATE);this._enableTime===0&&(this._enableTime=lr(performance.now()));const n=this.renderingContext,s=this.view.qualitySettings.fadeDuration,l=this.bindParameters,c=l.camera,u=c.relativeElevation,h=_i((xo-u)/(xo-Pd),0,1),m=s>0?Math.min(s,performance.now()-this._enableTime)/s:1,p=m*h;this._passParameters.normalTexture=r,this._passParameters.depthTexture=i,this._passParameters.projScale=1/c.computeScreenPixelSizeAtDist(1),this._passParameters.intensity=4*nu/Bi(c)**6*p;const v=c.fullViewport[2],x=c.fullViewport[3],_=this.fboCache.acquire(v,x,"ssao input",Y.RG8UNORM);n.bindFramebuffer(_.fbo),n.setViewport(0,0,v,x),n.bindTechnique(o,l,this._passParameters,this._drawParameters),n.screen.draw();const A=Math.round(v/jt),P=Math.round(x/jt),F=this.fboCache.acquire(A,P,"ssao blur",Y.R8UNORM);n.bindFramebuffer(F.fbo),this._drawParameters.colorTexture=_.getTexture(),lt(this._drawParameters.blurSize,0,jt/x),n.bindTechnique(a,l,this._passParameters,this._drawParameters),n.setViewport(0,0,A,P),n.screen.draw(),_.release();const D=this.fboCache.acquire(A,P,$r.SSAO,Y.R8UNORM);return n.bindFramebuffer(D.fbo),n.setViewport(0,0,v,x),n.setClearColor(1,1,1,0),n.clear(Xn.COLOR),this._drawParameters.colorTexture=F.getTexture(),lt(this._drawParameters.blurSize,jt/v,0),n.bindTechnique(a,l,this._passParameters,this._drawParameters),n.setViewport(0,0,A,P),n.screen.draw(),n.setViewport4fv(c.fullViewport),F.release(),m<1&&this.requestRender(ui.UPDATE),D}};f([W()],Lt.prototype,"consumes",void 0),f([W()],Lt.prototype,"produces",void 0),f([W({constructOnly:!0})],Lt.prototype,"isEnabled",void 0),Lt=f([Ti("esri.views.3d.webgl-engine.effects.ssao.SSAO")],Lt);const nu=.5;function Ui(t,e){e.receiveAmbientOcclusion?(t.uniforms.add(new Di("ssaoTex",r=>r.ssao?.getTexture())),t.constants.add("blurSizePixelsInverse","float",1/jt),t.code.add(d`float evaluateAmbientOcclusionInverse() {
vec2 ssaoTextureSizeInverse = 1.0 / vec2(textureSize(ssaoTex, 0));
return texture(ssaoTex, gl_FragCoord.xy * blurSizePixelsInverse * ssaoTextureSizeInverse).r;
}
float evaluateAmbientOcclusion() {
return 1.0 - evaluateAmbientOcclusionInverse();
}`)):t.code.add(d`float evaluateAmbientOcclusionInverse() { return 1.0; }
float evaluateAmbientOcclusion() { return 0.0; }`)}function su(t,e){const r=t.fragment,i=e.lightingSphericalHarmonicsOrder!==void 0?e.lightingSphericalHarmonicsOrder:2;i===0?(r.uniforms.add(new ct("lightingAmbientSH0",({lighting:o})=>te(Ro,o.sh.r[0],o.sh.g[0],o.sh.b[0]))),r.code.add(d`vec3 calculateAmbientIrradiance(vec3 normal, float ambientOcclusion) {
vec3 ambientLight = 0.282095 * lightingAmbientSH0;
return ambientLight * (1.0 - ambientOcclusion);
}`)):i===1?(r.uniforms.add(new Re("lightingAmbientSH_R",({lighting:o})=>xe(ze,o.sh.r[0],o.sh.r[1],o.sh.r[2],o.sh.r[3])),new Re("lightingAmbientSH_G",({lighting:o})=>xe(ze,o.sh.g[0],o.sh.g[1],o.sh.g[2],o.sh.g[3])),new Re("lightingAmbientSH_B",({lighting:o})=>xe(ze,o.sh.b[0],o.sh.b[1],o.sh.b[2],o.sh.b[3]))),r.code.add(d`vec3 calculateAmbientIrradiance(vec3 normal, float ambientOcclusion) {
vec4 sh0 = vec4(
0.282095,
0.488603 * normal.x,
0.488603 * normal.z,
0.488603 * normal.y
);
vec3 ambientLight = vec3(
dot(lightingAmbientSH_R, sh0),
dot(lightingAmbientSH_G, sh0),
dot(lightingAmbientSH_B, sh0)
);
return ambientLight * (1.0 - ambientOcclusion);
}`)):i===2&&(r.uniforms.add(new ct("lightingAmbientSH0",({lighting:o})=>te(Ro,o.sh.r[0],o.sh.g[0],o.sh.b[0])),new Re("lightingAmbientSH_R1",({lighting:o})=>xe(ze,o.sh.r[1],o.sh.r[2],o.sh.r[3],o.sh.r[4])),new Re("lightingAmbientSH_G1",({lighting:o})=>xe(ze,o.sh.g[1],o.sh.g[2],o.sh.g[3],o.sh.g[4])),new Re("lightingAmbientSH_B1",({lighting:o})=>xe(ze,o.sh.b[1],o.sh.b[2],o.sh.b[3],o.sh.b[4])),new Re("lightingAmbientSH_R2",({lighting:o})=>xe(ze,o.sh.r[5],o.sh.r[6],o.sh.r[7],o.sh.r[8])),new Re("lightingAmbientSH_G2",({lighting:o})=>xe(ze,o.sh.g[5],o.sh.g[6],o.sh.g[7],o.sh.g[8])),new Re("lightingAmbientSH_B2",({lighting:o})=>xe(ze,o.sh.b[5],o.sh.b[6],o.sh.b[7],o.sh.b[8]))),r.code.add(d`vec3 calculateAmbientIrradiance(vec3 normal, float ambientOcclusion) {
vec3 ambientLight = 0.282095 * lightingAmbientSH0;
vec4 sh1 = vec4(
0.488603 * normal.x,
0.488603 * normal.z,
0.488603 * normal.y,
1.092548 * normal.x * normal.y
);
vec4 sh2 = vec4(
1.092548 * normal.y * normal.z,
0.315392 * (3.0 * normal.z * normal.z - 1.0),
1.092548 * normal.x * normal.z,
0.546274 * (normal.x * normal.x - normal.y * normal.y)
);
ambientLight += vec3(
dot(lightingAmbientSH_R1, sh1),
dot(lightingAmbientSH_G1, sh1),
dot(lightingAmbientSH_B1, sh1)
);
ambientLight += vec3(
dot(lightingAmbientSH_R2, sh2),
dot(lightingAmbientSH_G2, sh2),
dot(lightingAmbientSH_B2, sh2)
);
return ambientLight * (1.0 - ambientOcclusion);
}`),e.pbrMode!==L.Normal&&e.pbrMode!==L.Schematic||r.code.add(d`const vec3 skyTransmittance = vec3(0.9, 0.9, 1.0);
vec3 calculateAmbientRadiance(float ambientOcclusion)
{
vec3 ambientLight = 1.2 * (0.282095 * lightingAmbientSH0) - 0.2;
return ambientLight *= (1.0 - ambientOcclusion) * skyTransmittance;
}`))}const Ro=C(),ze=Ei();function Pr(t){t.uniforms.add(new ct("mainLightDirection",e=>e.lighting.mainLight.direction))}function er(t){t.uniforms.add(new ct("mainLightIntensity",e=>e.lighting.mainLight.intensity))}function lu(t){Pr(t.fragment),er(t.fragment),t.fragment.code.add(d`vec3 applyShading(vec3 shadingNormal, float shadow) {
float dotVal = clamp(dot(shadingNormal, mainLightDirection), 0.0, 1.0);
return mainLightIntensity * ((1.0 - shadow) * dotVal);
}`)}function cu(t){t.code.add(d`vec3 evaluateDiffuseIlluminationHemisphere(vec3 ambientGround, vec3 ambientSky, float NdotNG) {
return ((1.0 - NdotNG) * ambientGround + (1.0 + NdotNG) * ambientSky) * 0.5;
}`),t.code.add(d`float integratedRadiance(float cosTheta2, float roughness) {
return (cosTheta2 - 1.0) / (cosTheta2 * (1.0 - roughness * roughness) - 1.0);
}`),t.code.add(d`vec3 evaluateSpecularIlluminationHemisphere(vec3 ambientGround, vec3 ambientSky, float RdotNG, float roughness) {
float cosTheta2 = 1.0 - RdotNG * RdotNG;
float intRadTheta = integratedRadiance(cosTheta2, roughness);
float ground = RdotNG < 0.0 ? 1.0 - intRadTheta : 1.0 + intRadTheta;
float sky = 2.0 - ground;
return (ground * ambientGround + sky * ambientSky) * 0.5;
}`)}function rn(t){const e=3.141592653589793,r=.3183098861837907;t.constants.add("PI","float",e),t.constants.add("LIGHT_NORMALIZATION","float",r),t.constants.add("INV_PI","float",r),t.constants.add("HALF_PI","float",1.570796326794897),t.constants.add("TWO_PI","float",6.28318530717958)}function Gi(t,e){t.include(rn),e.pbrMode!==L.Normal&&e.pbrMode!==L.Schematic&&e.pbrMode!==L.Simplified&&e.pbrMode!==L.TerrainWithWater||(t.code.add(d`float normalDistribution(float NdotH, float roughness)
{
float a = NdotH * roughness;
float b = roughness / (1.0 - NdotH * NdotH + a * a);
return b * b * INV_PI;
}`),t.code.add(d`const vec4 c0 = vec4(-1.0, -0.0275, -0.572,  0.022);
const vec4 c1 = vec4( 1.0,  0.0425,  1.040, -0.040);
const vec2 c2 = vec2(-1.04, 1.04);
vec2 prefilteredDFGAnalytical(float roughness, float NdotV) {
vec4 r = roughness * c0 + c1;
float a004 = min(r.x * r.x, exp2(-9.28 * NdotV)) * r.x + r.y;
return c2 * a004 + r.zw;
}`)),e.pbrMode!==L.Normal&&e.pbrMode!==L.Schematic||(t.include(cu),t.code.add(d`struct PBRShadingInfo
{
float NdotV;
float LdotH;
float NdotNG;
float RdotNG;
float NdotAmbDir;
float NdotH_Horizon;
vec3 skyRadianceToSurface;
vec3 groundRadianceToSurface;
vec3 skyIrradianceToSurface;
vec3 groundIrradianceToSurface;
float averageAmbientRadiance;
float ssao;
vec3 albedoLinear;
vec3 f0;
vec3 f90;
vec3 diffuseColor;
float metalness;
float roughness;
};`),t.code.add(d`vec3 evaluateEnvironmentIllumination(PBRShadingInfo inputs) {
vec3 indirectDiffuse = evaluateDiffuseIlluminationHemisphere(inputs.groundIrradianceToSurface, inputs.skyIrradianceToSurface, inputs.NdotNG);
vec3 indirectSpecular = evaluateSpecularIlluminationHemisphere(inputs.groundRadianceToSurface, inputs.skyRadianceToSurface, inputs.RdotNG, inputs.roughness);
vec3 diffuseComponent = inputs.diffuseColor * indirectDiffuse * INV_PI;
vec2 dfg = prefilteredDFGAnalytical(inputs.roughness, inputs.NdotV);
vec3 specularColor = inputs.f0 * dfg.x + inputs.f90 * dfg.y;
vec3 specularComponent = specularColor * indirectSpecular;
return (diffuseComponent + specularComponent);
}`))}let du=class extends k{constructor(e,r){super(e,"bool",S.Bind,(i,o)=>i.setUniform1b(e,r(o)))}};const uu=.4;function hu(t){t.code.add(d`float mapChannel(float x, vec2 p) {
return (x < p.x) ? mix(0.0, p.y, x/p.x) : mix(p.y, 1.0, (x - p.x) / (1.0 - p.x) );
}`),t.code.add(d`vec3 blackLevelSoftCompression(vec3 color, float averageAmbientRadiance) {
vec2 p = vec2(0.02, 0.0075) * averageAmbientRadiance;
return vec3(mapChannel(color.x, p), mapChannel(color.y, p), mapChannel(color.z, p));
}`)}function mu(t){t.code.add(d`vec3 tonemapACES(vec3 x) {
return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}`)}function zi(t){t.constants.add("ambientBoostFactor","float",uu)}function Vi(t){t.uniforms.add(new Rt("lightingGlobalFactor",e=>e.lighting.globalFactor))}function on(t,e){const r=t.fragment,{pbrMode:i,spherical:o,hasColorTexture:a}=e;r.include(Ui,e),i!==L.Disabled&&r.include(Gi,e),t.include(su,e),r.include(rn),r.include(mu,e);const n=!(i===L.Schematic&&!a);switch(n&&r.include(hu),r.code.add(d`
    const float GAMMA_SRGB = ${d.float(Bn)};
    const float INV_GAMMA_SRGB = 0.4761904;
    ${$(i!==L.Disabled,"const float GROUND_REFLECTANCE = 0.2;")}
  `),zi(r),Vi(r),Pr(r),r.code.add(d`
    float additionalDirectedAmbientLight(vec3 vPosWorld) {
      float vndl = dot(${o?d`normalize(vPosWorld)`:d`vec3(0.0, 0.0, 1.0)`}, mainLightDirection);
      return smoothstep(0.0, 1.0, clamp(vndl * 2.5, 0.0, 1.0));
    }
  `),er(r),r.code.add(d`vec3 evaluateAdditionalLighting(float ambientOcclusion, vec3 vPosWorld) {
float additionalAmbientScale = additionalDirectedAmbientLight(vPosWorld);
return (1.0 - ambientOcclusion) * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor * mainLightIntensity;
}`),i){case L.Disabled:case L.WaterOnIntegratedMesh:case L.Water:t.include(lu),r.code.add(d`vec3 evaluateSceneLighting(vec3 normalWorld, vec3 albedo, float shadow, float ssao, vec3 additionalLight) {
vec3 mainLighting = applyShading(normalWorld, shadow);
vec3 ambientLighting = calculateAmbientIrradiance(normalWorld, ssao);
vec3 albedoLinear = pow(albedo, vec3(GAMMA_SRGB));
vec3 totalLight = mainLighting + ambientLighting + additionalLight;
totalLight = min(totalLight, vec3(PI));
vec3 outColor = vec3((albedoLinear / PI) * totalLight);
return pow(outColor, vec3(INV_GAMMA_SRGB));
}`);break;case L.Normal:case L.Schematic:r.code.add(d`const float fillLightIntensity = 0.25;
const float horizonLightDiffusion = 0.4;
const float additionalAmbientIrradianceFactor = 0.02;
vec3 evaluateSceneLightingPBR(vec3 normal, vec3 albedo, float shadow, float ssao, vec3 additionalLight,
vec3 viewDir, vec3 groundNormal, vec3 mrr, vec4 _emission,
float additionalAmbientIrradiance) {
vec3 viewDirection = -viewDir;
vec3 h = normalize(viewDirection + mainLightDirection);
PBRShadingInfo inputs;
inputs.NdotV = clamp(abs(dot(normal, viewDirection)), 0.001, 1.0);
inputs.NdotNG = clamp(dot(normal, groundNormal), -1.0, 1.0);
vec3 reflectedView = normalize(reflect(viewDirection, normal));
inputs.RdotNG = clamp(dot(reflectedView, groundNormal), -1.0, 1.0);
inputs.albedoLinear = pow(albedo, vec3(GAMMA_SRGB));
inputs.ssao = ssao;
inputs.metalness = mrr[0];
inputs.roughness = clamp(mrr[1] * mrr[1], 0.001, 0.99);`),r.code.add(d`inputs.f0 = (0.16 * mrr[2] * mrr[2]) * (1.0 - inputs.metalness) + inputs.albedoLinear * inputs.metalness;
inputs.f90 = vec3(clamp(dot(inputs.f0, vec3(50.0 * 0.33)), 0.0, 1.0));
inputs.diffuseColor = inputs.albedoLinear * (vec3(1.0) - inputs.f0) * (1.0 - inputs.metalness);`),e.useFillLights?r.uniforms.add(new du("hasFillLights",s=>s.enableFillLights)):r.constants.add("hasFillLights","bool",!1),r.code.add(d`vec3 ambientDir = vec3(5.0 * groundNormal[1] - groundNormal[0] * groundNormal[2], - 5.0 * groundNormal[0] - groundNormal[2] * groundNormal[1], groundNormal[1] * groundNormal[1] + groundNormal[0] * groundNormal[0]);
ambientDir = ambientDir != vec3(0.0) ? normalize(ambientDir) : normalize(vec3(5.0, -1.0, 0.0));
inputs.NdotAmbDir = hasFillLights ? abs(dot(normal, ambientDir)) : 1.0;
float NdotL = clamp(dot(normal, mainLightDirection), 0.001, 1.0);
vec3 mainLightIrradianceComponent = NdotL * (1.0 - shadow) * mainLightIntensity;
vec3 fillLightsIrradianceComponent = inputs.NdotAmbDir * mainLightIntensity * fillLightIntensity;
vec3 ambientLightIrradianceComponent = calculateAmbientIrradiance(normal, ssao) + additionalLight;
inputs.skyIrradianceToSurface = ambientLightIrradianceComponent + mainLightIrradianceComponent + fillLightsIrradianceComponent ;
inputs.groundIrradianceToSurface = GROUND_REFLECTANCE * ambientLightIrradianceComponent + mainLightIrradianceComponent + fillLightsIrradianceComponent ;`),r.uniforms.add(new Rt("lightingSpecularStrength",s=>s.lighting.mainLight.specularStrength),new Rt("lightingEnvironmentStrength",s=>s.lighting.mainLight.environmentStrength)).code.add(d`vec3 horizonRingDir = inputs.RdotNG * groundNormal - reflectedView;
vec3 horizonRingH = normalize(viewDirection + horizonRingDir);
inputs.NdotH_Horizon = dot(normal, horizonRingH);
float NdotH = clamp(dot(normal, h), 0.0, 1.0);
vec3 mainLightRadianceComponent = lightingSpecularStrength * normalDistribution(NdotH, inputs.roughness) * mainLightIntensity * (1.0 - shadow);
vec3 horizonLightRadianceComponent = lightingEnvironmentStrength * normalDistribution(inputs.NdotH_Horizon, min(inputs.roughness + horizonLightDiffusion, 1.0)) * mainLightIntensity * fillLightIntensity;
vec3 ambientLightRadianceComponent = lightingEnvironmentStrength * calculateAmbientRadiance(ssao) + additionalLight;
float normalDirectionModifier = mix(1., min(mix(0.1, 2.0, (inputs.NdotNG + 1.) * 0.5), 1.0), clamp(inputs.roughness * 5.0, 0.0 , 1.0));
inputs.skyRadianceToSurface = (ambientLightRadianceComponent + horizonLightRadianceComponent) * normalDirectionModifier + mainLightRadianceComponent;
inputs.groundRadianceToSurface = 0.5 * GROUND_REFLECTANCE * (ambientLightRadianceComponent + horizonLightRadianceComponent) * normalDirectionModifier + mainLightRadianceComponent;
inputs.averageAmbientRadiance = ambientLightIrradianceComponent[1] * (1.0 + GROUND_REFLECTANCE);`),r.code.add(d`
        vec3 reflectedColorComponent = evaluateEnvironmentIllumination(inputs);
        vec3 additionalMaterialReflectanceComponent = inputs.albedoLinear * additionalAmbientIrradiance;
        vec3 emissionComponent = _emission.rgb == vec3(0.0) ? _emission.rgb : tonemapACES(pow(_emission.rgb, vec3(GAMMA_SRGB)));
        vec3 outColorLinear = reflectedColorComponent + additionalMaterialReflectanceComponent + emissionComponent;
        ${n?d`vec3 outColor = pow(blackLevelSoftCompression(outColorLinear, inputs.averageAmbientRadiance), vec3(INV_GAMMA_SRGB));`:d`vec3 outColor = pow(max(vec3(0.0), outColorLinear - 0.005 * inputs.averageAmbientRadiance), vec3(INV_GAMMA_SRGB));`}
        return outColor;
      }
    `);break;case L.Simplified:case L.TerrainWithWater:Pr(r),er(r),r.code.add(d`const float roughnessTerrain = 0.5;
const float specularityTerrain = 0.5;
const vec3 fresnelReflectionTerrain = vec3(0.04);
vec3 evaluatePBRSimplifiedLighting(vec3 n, vec3 c, float shadow, float ssao, vec3 al, vec3 vd, vec3 nup) {
vec3 viewDirection = -vd;
vec3 h = normalize(viewDirection + mainLightDirection);
float NdotL = clamp(dot(n, mainLightDirection), 0.001, 1.0);
float NdotV = clamp(abs(dot(n, viewDirection)), 0.001, 1.0);
float NdotH = clamp(dot(n, h), 0.0, 1.0);
float NdotNG = clamp(dot(n, nup), -1.0, 1.0);
vec3 albedoLinear = pow(c, vec3(GAMMA_SRGB));
float lightness = 0.3 * albedoLinear[0] + 0.5 * albedoLinear[1] + 0.2 * albedoLinear[2];
vec3 f0 = (0.85 * lightness + 0.15) * fresnelReflectionTerrain;
vec3 f90 =  vec3(clamp(dot(f0, vec3(50.0 * 0.33)), 0.0, 1.0));
vec3 mainLightIrradianceComponent = (1. - shadow) * NdotL * mainLightIntensity;
vec3 ambientLightIrradianceComponent = calculateAmbientIrradiance(n, ssao) + al;
vec3 ambientSky = ambientLightIrradianceComponent + mainLightIrradianceComponent;
vec3 indirectDiffuse = ((1.0 - NdotNG) * mainLightIrradianceComponent + (1.0 + NdotNG ) * ambientSky) * 0.5;
vec3 outDiffColor = albedoLinear * (1.0 - f0) * indirectDiffuse / PI;
vec3 mainLightRadianceComponent = normalDistribution(NdotH, roughnessTerrain) * mainLightIntensity;
vec2 dfg = prefilteredDFGAnalytical(roughnessTerrain, NdotV);
vec3 specularColor = f0 * dfg.x + f90 * dfg.y;
vec3 specularComponent = specularityTerrain * specularColor * mainLightRadianceComponent;
vec3 outColorLinear = outDiffColor + specularComponent;
vec3 outColor = pow(outColorLinear, vec3(INV_GAMMA_SRGB));
return outColor;
}`);default:case L.COUNT:}}let pu=class extends k{constructor(e,r,i){super(e,"mat4",S.Draw,(o,a,n,s)=>o.setUniformMatrix4fv(e,r(a,n,s)),i)}},fu=class extends k{constructor(e,r,i){super(e,"mat4",S.Pass,(o,a,n)=>o.setUniformMatrix4fv(e,r(a,n)),i)}};function gu(t){t.fragment.uniforms.add(new fu("shadowMapMatrix",(e,r)=>r.shadowMap.getShadowMapMatrices(e.origin),4)),an(t)}function vu(t){t.fragment.uniforms.add(new pu("shadowMapMatrix",(e,r)=>r.shadowMap.getShadowMapMatrices(e.origin),4)),an(t)}function an(t){const{fragment:e}=t;e.uniforms.add(new Re("cascadeDistances",r=>r.shadowMap.cascadeDistances),new Ya("numCascades",r=>r.shadowMap.numCascades)),e.code.add(d`const vec3 invalidShadowmapUVZ = vec3(0.0, 0.0, -1.0);
vec3 lightSpacePosition(vec3 _vpos, mat4 mat) {
vec4 lv = mat * vec4(_vpos, 1.0);
lv.xy /= lv.w;
return 0.5 * lv.xyz + vec3(0.5);
}
vec2 cascadeCoordinates(int i, ivec2 textureSize, vec3 lvpos) {
float xScale = float(textureSize.y) / float(textureSize.x);
return vec2((float(i) + lvpos.x) * xScale, lvpos.y);
}
vec3 calculateUVZShadow(in vec3 _worldPos, in float _linearDepth, in ivec2 shadowMapSize) {
int i = _linearDepth < cascadeDistances[1] ? 0 : _linearDepth < cascadeDistances[2] ? 1 : _linearDepth < cascadeDistances[3] ? 2 : 3;
if (i >= numCascades) {
return invalidShadowmapUVZ;
}
mat4 shadowMatrix = i == 0 ? shadowMapMatrix[0] : i == 1 ? shadowMapMatrix[1] : i == 2 ? shadowMapMatrix[2] : shadowMapMatrix[3];
vec3 lvpos = lightSpacePosition(_worldPos, shadowMatrix);
if (lvpos.z >= 1.0 || lvpos.x < 0.0 || lvpos.x > 1.0 || lvpos.y < 0.0 || lvpos.y > 1.0) {
return invalidShadowmapUVZ;
}
vec2 uvShadow = cascadeCoordinates(i, shadowMapSize, lvpos);
return vec3(uvShadow, lvpos.z);
}`)}function Tu(t){t.fragment.code.add(d`float readShadowMapUVZ(vec3 uvzShadow, sampler2DShadow _shadowMap) {
return texture(_shadowMap, uvzShadow);
}`)}class xu extends k{constructor(e,r){super(e,"sampler2DShadow",S.Bind,(i,o)=>i.bindTexture(e,r(o)))}}function nn(t,e){e.receiveShadows&&(t.include(gu),ln(t))}function sn(t,e){e.receiveShadows&&(t.include(vu),ln(t))}function ln(t){t.include(Tu);const{fragment:e}=t;e.uniforms.add(new xu("shadowMap",r=>r.shadowMap.depthTexture)),e.code.add(d`float readShadowMap(const in vec3 _worldPos, float _linearDepth) {
vec3 uvzShadow = calculateUVZShadow(_worldPos, _linearDepth, textureSize(shadowMap,0));
if (uvzShadow.z < 0.0) {
return 0.0;
}
return readShadowMapUVZ(uvzShadow, shadowMap);
}`)}function cn(t,{occlusionPass:e,terrainDepthTest:r,cullAboveTerrain:i}){const{vertex:o,fragment:a,varyings:n}=t;if(!r)return o.code.add("void forwardViewPosDepth(vec3 pos) {}"),void a.code.add(`${e?"bool":"void"} discardByTerrainDepth() { ${$(e,"return false;")}}`);n.add("viewPosDepth","float",{invariant:!0}),o.code.add(`void forwardViewPosDepth(vec3 pos) {
    viewPosDepth = pos.z;
  }`),a.include(Li),a.uniforms.add(new Di("terrainDepthTexture",s=>s.terrainDepth?.attachment)).code.add(d`
    ${e?"bool":"void"} discardByTerrainDepth() {
      float depth = texelFetch(terrainDepthTexture, ivec2(gl_FragCoord.xy), 0).r;
      float linearDepth = linearizeDepth(depth);
      ${e?"return viewPosDepth < linearDepth && depth < 1.0;":`if(viewPosDepth ${i?">":"<="} linearDepth) discard;`}
    }`)}function _u(t,e){e.hasColorTextureTransform?(t.varyings.add("colorUV","vec2"),t.vertex.uniforms.add(new Fe("colorTextureTransformMatrix",r=>r.colorTextureTransformMatrix??Ot)).code.add(d`void forwardColorUV(){
colorUV = (colorTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):t.vertex.code.add(d`void forwardColorUV(){}`)}function Eu(t,e){e.hasNormalTextureTransform&&e.textureCoordinateType!==ce.None?(t.varyings.add("normalUV","vec2"),t.vertex.uniforms.add(new Fe("normalTextureTransformMatrix",r=>r.normalTextureTransformMatrix??Ot)).code.add(d`void forwardNormalUV(){
normalUV = (normalTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):t.vertex.code.add(d`void forwardNormalUV(){}`)}function bu(t,e){e.hasEmissionTextureTransform&&e.textureCoordinateType!==ce.None?(t.varyings.add("emissiveUV","vec2"),t.vertex.uniforms.add(new Fe("emissiveTextureTransformMatrix",r=>r.emissiveTextureTransformMatrix??Ot)).code.add(d`void forwardEmissiveUV(){
emissiveUV = (emissiveTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):t.vertex.code.add(d`void forwardEmissiveUV(){}`)}function Su(t,e){e.hasOcclusionTextureTransform&&e.textureCoordinateType!==ce.None?(t.varyings.add("occlusionUV","vec2"),t.vertex.uniforms.add(new Fe("occlusionTextureTransformMatrix",r=>r.occlusionTextureTransformMatrix??Ot)).code.add(d`void forwardOcclusionUV(){
occlusionUV = (occlusionTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):t.vertex.code.add(d`void forwardOcclusionUV(){}`)}function wu(t,e){e.hasMetallicRoughnessTextureTransform&&e.textureCoordinateType!==ce.None?(t.varyings.add("metallicRoughnessUV","vec2"),t.vertex.uniforms.add(new Fe("metallicRoughnessTextureTransformMatrix",r=>r.metallicRoughnessTextureTransformMatrix??Ot)).code.add(d`void forwardMetallicRoughnessUV(){
metallicRoughnessUV = (metallicRoughnessTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):t.vertex.code.add(d`void forwardMetallicRoughnessUV(){}`)}function dn(t){t.code.add(d`vec4 premultiplyAlpha(vec4 v) {
return vec4(v.rgb * v.a, v.a);
}
vec3 rgb2hsv(vec3 c) {
vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
vec4 p = c.g < c.b ? vec4(c.bg, K.wz) : vec4(c.gb, K.xy);
vec4 q = c.r < p.x ? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);
float d = q.x - min(q.w, q.y);
float e = 1.0e-10;
return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), min(d / (q.x + e), 1.0), q.x);
}
vec3 hsv2rgb(vec3 c) {
vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
float rgb2v(vec3 c) {
return max(c.x, max(c.y, c.z));
}`)}function un(t){t.include(dn),t.code.add(d`
    vec3 mixExternalColor(vec3 internalColor, vec3 textureColor, vec3 externalColor, int mode) {
      // workaround for artifacts in macOS using Intel Iris Pro
      // see: https://devtopia.esri.com/WebGIS/arcgis-js-api/issues/10475
      vec3 internalMixed = internalColor * textureColor;
      vec3 allMixed = internalMixed * externalColor;

      if (mode == ${d.int(Ve.Multiply)}) {
        return allMixed;
      }
      if (mode == ${d.int(Ve.Ignore)}) {
        return internalMixed;
      }
      if (mode == ${d.int(Ve.Replace)}) {
        return externalColor;
      }

      // tint (or something invalid)
      float vIn = rgb2v(internalMixed);
      vec3 hsvTint = rgb2hsv(externalColor);
      vec3 hsvOut = vec3(hsvTint.x, hsvTint.y, vIn * hsvTint.z);
      return hsv2rgb(hsvOut);
    }

    float mixExternalOpacity(float internalOpacity, float textureOpacity, float externalOpacity, int mode) {
      // workaround for artifacts in macOS using Intel Iris Pro
      // see: https://devtopia.esri.com/WebGIS/arcgis-js-api/issues/10475
      float internalMixed = internalOpacity * textureOpacity;
      float allMixed = internalMixed * externalOpacity;

      if (mode == ${d.int(Ve.Ignore)}) {
        return internalMixed;
      }
      if (mode == ${d.int(Ve.Replace)}) {
        return externalOpacity;
      }

      // multiply or tint (or something invalid)
      return allMixed;
    }
  `)}function Mu(t,e){e.snowCover&&(t.code.add(d`float getSnow(vec3 normal, vec3 normalGround) {
return smoothstep(0.5, 0.55, dot(normal, normalGround));
}`),t.code.add(d`vec3 applySnowToMRR(vec3 mrr, float snow) {
return mix(mrr, vec3(0.0, 1.0, 0.04), snow);
}
vec4 snowCoverForEmissions(vec4 emission, float snow) {
return mix(emission, vec4(0.0), snow);
}`))}function hn(t,e){t.include(Za,e),t.include(fl,e),t.fragment.include(dn);const{output:r,oitPass:i,discardInvisibleFragments:o,snowCover:a}=e,n=r===j.ObjectAndLayerIdColor,s=Si(r),l=Je(r)&&i===ie.ColorAlpha,c=Je(r)&&i!==ie.ColorAlpha;let u=0;(c||s||l)&&t.outputs.add("fragColor","vec4",u++),s&&t.outputs.add("fragEmission","vec4",u++),l&&t.outputs.add("fragAlpha","float",u++),t.fragment.code.add(d`
    void outputColorHighlightOID(vec4 finalColor, const in vec3 vWorldPosition, vec3 emissiveBaseColor ${$(a,", float snow")}) {
      ${$(n,"finalColor.a = 1.0;")}

      ${$(o,`if (finalColor.a < ${d.float(It)}) { discard; }`)}

      finalColor = applySlice(finalColor, vWorldPosition);
      ${$(l,d`fragColor = premultiplyAlpha(finalColor);
             fragAlpha = finalColor.a;`)}
      ${$(c,"fragColor = finalColor;")}
      ${$(s,`fragEmission = ${$(a,"mix(finalColor.a * getEmissions(emissiveBaseColor), vec4(0.0), snow);","finalColor.a * getEmissions(emissiveBaseColor);")}`)}
      calculateOcclusionAndOutputHighlight();
      ${$(n,"outputObjectAndLayerIdColor();")}
    }
  `)}function Au(t){const e=new qr,{attributes:r,vertex:i,fragment:o,varyings:a}=e,{output:n,normalType:s,offsetBackfaces:l,instancedColor:c,spherical:u,receiveShadows:h,snowCover:m,pbrMode:p,textureAlphaPremultiplied:v,instancedDoublePrecision:x,hasVertexColors:_,hasVertexTangents:A,hasColorTexture:P,hasNormalTexture:F,hasNormalTextureTransform:D,hasColorTextureTransform:z,hasBloom:V}=t;if(St(i,t),r.add(T.POSITION,"vec3"),a.add("vpos","vec3",{invariant:!0}),e.include(Yt,t),e.include(Wa,t),e.include(Xa,t),e.include(_u,t),!Je(n))return e.include(Ja,t),e;e.include(Eu,t),e.include(bu,t),e.include(Su,t),e.include(wu,t),Qt(i,t),e.include(Dr,t),e.include(bt,t);const w=s===le.Attribute||s===le.Compressed;return w&&l&&e.include(Fa),e.include(Nd,t),e.include($a,t),c&&e.attributes.add(T.INSTANCECOLOR,"vec4"),a.add("vPositionLocal","vec3"),e.include(rt,t),e.include(La,t),e.include(ja,t),e.include(ka,t),i.uniforms.add(new kr("externalColor",E=>E.colorMixMode==="ignore"?Un:E.externalColor)),a.add("vcolorExt","vec4"),e.include(cn,t),i.main.add(d`
    forwardNormalizedVertexColor();
    vcolorExt = externalColor;
    ${$(c,"vcolorExt *= instanceColor * 0.003921568627451;")}
    vcolorExt *= vvColor();
    vcolorExt *= getSymbolColor();
    forwardColorMixMode();

    vpos = getVertexInLocalOriginSpace();
    vPositionLocal = vpos - view[3].xyz;
    vpos = subtractOrigin(vpos);
    ${$(w,"vNormalWorld = dpNormal(vvLocalNormal(normalModel()));")}
    vpos = addVerticalOffset(vpos, localOrigin);
    ${$(A,"vTangent = dpTransformVertexTangent(tangent);")}
    gl_Position = transformPosition(proj, view, vpos);
    ${$(w&&l,"gl_Position = offsetBackfacingClipPosition(gl_Position, vpos, vNormalWorld, cameraPosition);")}

    forwardViewPosDepth((view * vec4(vpos, 1.0)).xyz);
    forwardLinearDepth();
    forwardTextureCoordinates();
    forwardColorUV();
    forwardNormalUV();
    forwardEmissiveUV();
    forwardOcclusionUV();
    forwardMetallicRoughnessUV();

    if (vcolorExt.a < ${d.float(It)}) {
      gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
    }
  `),e.include(on,t),o.include(Ui,t),e.include(Mt,t),e.include(x?nn:sn,t),o.include(Et,t),e.include(hn,t),Qt(o,t),o.uniforms.add(i.uniforms.get("localOrigin"),new ae("ambient",E=>E.ambient),new ae("diffuse",E=>E.diffuse),new We("opacity",E=>E.opacity),new We("layerOpacity",E=>E.layerOpacity)),P&&o.uniforms.add(new fe("tex",E=>E.texture)),e.include(ra,t),o.include(Gi,t),o.include(un),e.include(gl,t),o.include(Mu,t),zi(o),Vi(o),er(o),o.main.add(d`
    discardBySlice(vpos);
    discardByTerrainDepth();
    ${P?d`
            vec4 texColor = texture(tex, ${z?"colorUV":"vuv0"});
            ${$(v,"texColor.rgb /= texColor.a;")}
            discardOrAdjustAlpha(texColor);`:d`vec4 texColor = vec4(1.0);`}
    shadingParams.viewDirection = normalize(vpos - cameraPosition);
    ${s===le.ScreenDerivative?d`vec3 normal = screenDerivativeNormal(vPositionLocal);`:d`shadingParams.normalView = vNormalWorld;
                vec3 normal = shadingNormal(shadingParams);`}
    applyPBRFactors();
    float ssao = evaluateAmbientOcclusionInverse() * getBakedOcclusion();

    vec3 posWorld = vpos + localOrigin;

      float additionalAmbientScale = additionalDirectedAmbientLight(posWorld);
      float shadow = ${h?"max(lightingGlobalFactor * (1.0 - additionalAmbientScale), readShadowMap(vpos, linearDepth))":$(u,"lightingGlobalFactor * (1.0 - additionalAmbientScale)","0.0")};

    vec3 matColor = max(ambient, diffuse);
    vec3 albedo = mixExternalColor(${$(_,"vColor.rgb *")} matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
    float opacity_ = layerOpacity * mixExternalOpacity(${$(_,"vColor.a * ")} opacity, texColor.a, vcolorExt.a, int(colorMixMode));
    ${F?`mat3 tangentSpace = computeTangentSpace(${A?"normal":"normal, vpos, vuv0"});
            vec3 shadingNormal = computeTextureNormal(tangentSpace, ${D?"normalUV":"vuv0"});`:"vec3 shadingNormal = normal;"}
    vec3 normalGround = ${u?"normalize(posWorld);":"vec3(0.0, 0.0, 1.0);"}

    ${$(m,d`
          float snow = getSnow(normal, normalGround);
          albedo = mix(albedo, vec3(1), snow);
          shadingNormal = mix(shadingNormal, normal, snow);
          ssao = mix(ssao, 1.0, snow);`)}

    vec3 additionalLight = ssao * mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;

    ${p===L.Normal||p===L.Schematic?d`
            float additionalAmbientIrradiance = additionalAmbientIrradianceFactor * mainLightIntensity[2];
            vec4 emission = ${V?"vec4(0.0)":"getEmissions(albedo)"};
            ${$(m,`mrr = applySnowToMRR(mrr, snow);
                 emission = snowCoverForEmissions(emission, snow);`)}
            vec3 shadedColor = evaluateSceneLightingPBR(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight, shadingParams.viewDirection, normalGround, mrr, emission, additionalAmbientIrradiance);`:d`vec3 shadedColor = evaluateSceneLighting(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight);`}
    vec4 finalColor = vec4(shadedColor, opacity_);
    outputColorHighlightOID(finalColor, vpos, albedo ${$(m,", snow")});
  `),e}const Ru=Object.freeze(Object.defineProperty({__proto__:null,build:Au},Symbol.toStringTag,{value:"Module"}));class yu extends od{constructor(){super(...arguments),this.isSchematic=!1,this.usePBR=!1,this.mrrFactors=vl,this.hasVertexColors=!1,this.hasSymbolColors=!1,this.doubleSided=!1,this.doubleSidedType="normal",this.cullFace=nt.Back,this.isInstanced=!1,this.hasInstancedColor=!1,this.emissiveStrength=0,this.emissiveSource=Ut.Color,this.emissiveBaseColor=Ct,this.instancedDoublePrecision=!1,this.normalType=le.Attribute,this.receiveShadows=!0,this.receiveAmbientOcclusion=!0,this.castShadows=!0,this.ambient=Zt(.2,.2,.2),this.diffuse=Zt(.8,.8,.8),this.externalColor=Gn(1,1,1,1),this.colorMixMode="multiply",this.opacity=1,this.layerOpacity=1,this.origin=C(),this.hasSlicePlane=!1,this.offsetTransparentBackfaces=!1,this.vvSize=null,this.vvColor=null,this.vvOpacity=null,this.vvSymbolAnchor=null,this.vvSymbolRotationMatrix=null,this.modelTransformation=null,this.drivenOpacity=!1,this.writeDepth=!0,this.customDepthTest=rr.Less,this.textureAlphaMode=ye.Blend,this.textureAlphaCutoff=It,this.textureAlphaPremultiplied=!1,this.renderOccluded=yr.Occlude,this.isDecoration=!1}}class mn extends Pi{constructor(e,r,i=new Wr(Ru,()=>tr(()=>import("./DefaultMaterial.glsl-cf4a9e55.js"),["assets/DefaultMaterial.glsl-cf4a9e55.js","assets/index-f00bd99f.js","assets/index-a5714ce2.css","assets/NormalAttribute.glsl-c8a94bd0.js","assets/VertexAttribute-123db042.js","assets/mat3f64-d34bdb1e.js","assets/mat4f64-a3dc1405.js","assets/mat3-cd249fcd.js","assets/vec32-6757f7c3.js","assets/sphere-47db6b49.js","assets/vectorStacks-5954743a.js","assets/quatf64-216ddd5a.js","assets/vec2f64-44b9a02c.js","assets/orientedBoundingBox-b5a2f26d.js","assets/quat-b2e4eef3.js","assets/spatialReferenceEllipsoidUtils-eb97be5b.js","assets/computeTranslationToOriginAndRotation-40e271f0.js","assets/plane-d072a060.js","assets/basicInterfaces-cbf2757f.js","assets/vec2-c0ea4c96.js","assets/videoUtils-7880a0f1.js","assets/TextureFormat-60b88abd.js","assets/enums-ff43618c.js","assets/BufferView-920eb48c.js","assets/lineSegment-eb444802.js","assets/InterleavedLayout-9da534c5.js","assets/types-d99602e0.js"]))){super(e,r,i),this.type="DefaultMaterialTechnique"}_makePipeline(e,r){const{oitPass:i,output:o,transparent:a,cullFace:n,customDepthTest:s,hasOccludees:l}=e;return Hr({blending:Je(o)&&a?xc(i):null,culling:Ou(e)?Jl(n):null,depthTest:{func:wc(i,Cu(s))},depthWrite:_c(e),drawBuffers:nd(o,Mc(i,o)),colorWrite:Vr,stencilWrite:l?sd:null,stencilTest:l?r?cd:ld:null,polygonOffset:Sc(e)})}initializePipeline(e){return this._occludeePipelineState=this._makePipeline(e,!0),this._makePipeline(e,!1)}getPipeline(e){return e?this._occludeePipelineState:super.getPipeline()}}function Cu(t){return t===rr.Lequal?Le.LEQUAL:Le.LESS}function Ou(t){return t.cullFace!==nt.None||!t.hasSlicePlane&&!t.transparent&&!t.doubleSidedMode}class N extends xt{constructor(e){super(),this.spherical=e,this.alphaDiscardMode=ye.Opaque,this.doubleSidedMode=ve.None,this.pbrMode=L.Disabled,this.cullFace=nt.None,this.normalType=le.Attribute,this.customDepthTest=rr.Less,this.emissionSource=me.None,this.hasVertexColors=!1,this.hasSymbolColors=!1,this.hasVerticalOffset=!1,this.hasColorTexture=!1,this.hasMetallicRoughnessTexture=!1,this.hasOcclusionTexture=!1,this.hasNormalTexture=!1,this.hasScreenSizePerspective=!1,this.hasVertexTangents=!1,this.hasOccludees=!1,this.instancedDoublePrecision=!1,this.hasModelTransformation=!1,this.offsetBackfaces=!1,this.vvSize=!1,this.vvColor=!1,this.receiveShadows=!1,this.receiveAmbientOcclusion=!1,this.textureAlphaPremultiplied=!1,this.instanced=!1,this.instancedColor=!1,this.writeDepth=!0,this.transparent=!1,this.enableOffset=!0,this.terrainDepthTest=!1,this.cullAboveTerrain=!1,this.snowCover=!1,this.hasBloom=!1,this.hasColorTextureTransform=!1,this.hasEmissionTextureTransform=!1,this.hasNormalTextureTransform=!1,this.hasOcclusionTextureTransform=!1,this.hasMetallicRoughnessTextureTransform=!1,this.occlusionPass=!1,this.hasVvInstancing=!0,this.useCustomDTRExponentForWater=!1,this.useFillLights=!0,this.draped=!1}get textureCoordinateType(){return this.hasColorTexture||this.hasMetallicRoughnessTexture||this.emissionSource===me.Texture||this.hasOcclusionTexture||this.hasNormalTexture?ce.Default:ce.None}get objectAndLayerIdColorInstanced(){return this.instanced}get discardInvisibleFragments(){return this.transparent}}f([y({count:ye.COUNT})],N.prototype,"alphaDiscardMode",void 0),f([y({count:ve.COUNT})],N.prototype,"doubleSidedMode",void 0),f([y({count:L.COUNT})],N.prototype,"pbrMode",void 0),f([y({count:nt.COUNT})],N.prototype,"cullFace",void 0),f([y({count:le.COUNT})],N.prototype,"normalType",void 0),f([y({count:rr.COUNT})],N.prototype,"customDepthTest",void 0),f([y({count:me.COUNT})],N.prototype,"emissionSource",void 0),f([y()],N.prototype,"hasVertexColors",void 0),f([y()],N.prototype,"hasSymbolColors",void 0),f([y()],N.prototype,"hasVerticalOffset",void 0),f([y()],N.prototype,"hasColorTexture",void 0),f([y()],N.prototype,"hasMetallicRoughnessTexture",void 0),f([y()],N.prototype,"hasOcclusionTexture",void 0),f([y()],N.prototype,"hasNormalTexture",void 0),f([y()],N.prototype,"hasScreenSizePerspective",void 0),f([y()],N.prototype,"hasVertexTangents",void 0),f([y()],N.prototype,"hasOccludees",void 0),f([y()],N.prototype,"instancedDoublePrecision",void 0),f([y()],N.prototype,"hasModelTransformation",void 0),f([y()],N.prototype,"offsetBackfaces",void 0),f([y()],N.prototype,"vvSize",void 0),f([y()],N.prototype,"vvColor",void 0),f([y()],N.prototype,"receiveShadows",void 0),f([y()],N.prototype,"receiveAmbientOcclusion",void 0),f([y()],N.prototype,"textureAlphaPremultiplied",void 0),f([y()],N.prototype,"instanced",void 0),f([y()],N.prototype,"instancedColor",void 0),f([y()],N.prototype,"writeDepth",void 0),f([y()],N.prototype,"transparent",void 0),f([y()],N.prototype,"enableOffset",void 0),f([y()],N.prototype,"terrainDepthTest",void 0),f([y()],N.prototype,"cullAboveTerrain",void 0),f([y()],N.prototype,"snowCover",void 0),f([y()],N.prototype,"hasBloom",void 0),f([y()],N.prototype,"hasColorTextureTransform",void 0),f([y()],N.prototype,"hasEmissionTextureTransform",void 0),f([y()],N.prototype,"hasNormalTextureTransform",void 0),f([y()],N.prototype,"hasOcclusionTextureTransform",void 0),f([y()],N.prototype,"hasMetallicRoughnessTextureTransform",void 0);function Iu(t){const e=new qr,{attributes:r,vertex:i,fragment:o,varyings:a}=e,{output:n,offsetBackfaces:s,instancedColor:l,pbrMode:c,snowCover:u,spherical:h,hasBloom:m}=t,p=c===L.Normal||c===L.Schematic;if(St(i,t),r.add(T.POSITION,"vec3"),a.add("vpos","vec3",{invariant:!0}),e.include(Yt,t),e.include(Wa,t),e.include(Xa,t),e.include(cn,t),Je(n)&&(Qt(e.vertex,t),e.include(Dr,t),e.include(bt,t),s&&e.include(Fa),l&&e.attributes.add(T.INSTANCECOLOR,"vec4"),a.add("vNormalWorld","vec3"),a.add("localvpos","vec3",{invariant:!0}),e.include(rt,t),e.include(La,t),e.include(ja,t),e.include(ka,t),i.uniforms.add(new kr("externalColor",v=>v.externalColor)),a.add("vcolorExt","vec4"),i.main.add(d`
      forwardNormalizedVertexColor();
      vcolorExt = externalColor;
      ${$(l,"vcolorExt *= instanceColor * 0.003921568627451;")}
      vcolorExt *= vvColor();
      vcolorExt *= getSymbolColor();
      forwardColorMixMode();

      bool alphaCut = vcolorExt.a < ${d.float(It)};
      vpos = getVertexInLocalOriginSpace();
      localvpos = vpos - view[3].xyz;
      vpos = subtractOrigin(vpos);
      vNormalWorld = dpNormal(vvLocalNormal(normalModel()));
      vpos = addVerticalOffset(vpos, localOrigin);
      vec4 basePosition = transformPosition(proj, view, vpos);

      forwardViewPosDepth((view * vec4(vpos, 1.0)).xyz);
      forwardLinearDepth();
      forwardTextureCoordinates();

      gl_Position = alphaCut ? vec4(1e38, 1e38, 1e38, 1.0) :
      ${$(s,"offsetBackfacingClipPosition(basePosition, vpos, vNormalWorld, cameraPosition);","basePosition;")}
    `)),Je(n)){const{hasColorTexture:v,hasColorTextureTransform:x,receiveShadows:_}=t;e.include(on,t),o.include(Ui,t),e.include(Mt,t),e.include(t.instancedDoublePrecision?nn:sn,t),o.include(Et,t),e.include(hn,t),Qt(o,t),Pr(o),zi(o),Vi(o),o.uniforms.add(i.uniforms.get("localOrigin"),i.uniforms.get("view"),new ae("ambient",A=>A.ambient),new ae("diffuse",A=>A.diffuse),new We("opacity",A=>A.opacity),new We("layerOpacity",A=>A.layerOpacity)),v&&o.uniforms.add(new fe("tex",A=>A.texture)),e.include(ra,t),o.include(Gi,t),o.include(un),er(o),o.main.add(d`
      discardBySlice(vpos);
      discardByTerrainDepth();
      vec4 texColor = ${v?`texture(tex, ${x?"colorUV":"vuv0"})`:" vec4(1.0)"};
      ${$(v,`${$(t.textureAlphaPremultiplied,"texColor.rgb /= texColor.a;")}
        discardOrAdjustAlpha(texColor);`)}
      vec3 viewDirection = normalize(vpos - cameraPosition);
      applyPBRFactors();
      float ssao = evaluateAmbientOcclusionInverse();
      ssao *= getBakedOcclusion();

      float additionalAmbientScale = additionalDirectedAmbientLight(vpos + localOrigin);
      vec3 additionalLight = ssao * mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;
      float shadow = ${_?"max(lightingGlobalFactor * (1.0 - additionalAmbientScale), readShadowMap(vpos, linearDepth))":h?"lightingGlobalFactor * (1.0 - additionalAmbientScale)":"0.0"};
      vec3 matColor = max(ambient, diffuse);
      ${t.hasVertexColors?d`vec3 albedo = mixExternalColor(vColor.rgb * matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
             float opacity_ = layerOpacity * mixExternalOpacity(vColor.a * opacity, texColor.a, vcolorExt.a, int(colorMixMode));`:d`vec3 albedo = mixExternalColor(matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
             float opacity_ = layerOpacity * mixExternalOpacity(opacity, texColor.a, vcolorExt.a, int(colorMixMode));`}
      ${$(u,"albedo = mix(albedo, vec3(1), 0.9);")}
      ${d`vec3 shadingNormal = normalize(vNormalWorld);
             albedo *= 1.2;
             vec3 viewForward = vec3(view[0][2], view[1][2], view[2][2]);
             float alignmentLightView = clamp(dot(viewForward, -mainLightDirection), 0.0, 1.0);
             float transmittance = 1.0 - clamp(dot(viewForward, shadingNormal), 0.0, 1.0);
             float treeRadialFalloff = vColor.r;
             float backLightFactor = 0.5 * treeRadialFalloff * alignmentLightView * transmittance * (1.0 - shadow);
             additionalLight += backLightFactor * mainLightIntensity;`}
      ${$(p,`vec3 normalGround = ${h?"normalize(vpos + localOrigin)":"vec3(0.0, 0.0, 1.0)"};`)}
      ${p?d`float additionalAmbientIrradiance = additionalAmbientIrradianceFactor * mainLightIntensity[2];
                 ${$(u,d`mrr = applySnowToMRR(mrr, 1.0)`)}
            vec4 emission = ${u||m?"vec4(0.0)":"getEmissions(albedo)"};
            vec3 shadedColor = evaluateSceneLightingPBR(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight, viewDirection, normalGround, mrr, emission, additionalAmbientIrradiance);`:d`vec3 shadedColor = evaluateSceneLighting(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight);`}
      vec4 finalColor = vec4(shadedColor, opacity_);
      outputColorHighlightOID(finalColor, vpos, albedo ${$(u,", 1.0")});`)}return e.include(Ja,t),e}const Nu=Object.freeze(Object.defineProperty({__proto__:null,build:Iu},Symbol.toStringTag,{value:"Module"}));class $u extends mn{constructor(e,r){super(e,r,new Wr(Nu,()=>tr(()=>import("./RealisticTree.glsl-d5bacb7a.js"),["assets/RealisticTree.glsl-d5bacb7a.js","assets/NormalAttribute.glsl-c8a94bd0.js","assets/index-f00bd99f.js","assets/index-a5714ce2.css","assets/VertexAttribute-123db042.js","assets/mat3f64-d34bdb1e.js","assets/mat4f64-a3dc1405.js","assets/mat3-cd249fcd.js","assets/vec32-6757f7c3.js","assets/sphere-47db6b49.js","assets/vectorStacks-5954743a.js","assets/quatf64-216ddd5a.js","assets/vec2f64-44b9a02c.js","assets/orientedBoundingBox-b5a2f26d.js","assets/quat-b2e4eef3.js","assets/spatialReferenceEllipsoidUtils-eb97be5b.js","assets/computeTranslationToOriginAndRotation-40e271f0.js","assets/plane-d072a060.js","assets/basicInterfaces-cbf2757f.js","assets/vec2-c0ea4c96.js","assets/videoUtils-7880a0f1.js","assets/TextureFormat-60b88abd.js","assets/enums-ff43618c.js","assets/BufferView-920eb48c.js","assets/lineSegment-eb444802.js","assets/InterleavedLayout-9da534c5.js","assets/types-d99602e0.js"]))),this.type="RealisticTreeTechnique"}}class Vm extends kl{constructor(e,r){super(e,Du),this.materialType="default",this.supportsEdges=!0,this.intersectDraped=void 0,this.produces=new Map([[Xt.OPAQUE_MATERIAL,i=>(to(i)||Qr(i))&&!this.transparent],[Xt.TRANSPARENT_MATERIAL,i=>(to(i)||Qr(i))&&this.transparent&&this.parameters.writeDepth],[Xt.TRANSPARENT_MATERIAL_WITHOUT_DEPTH,i=>(ds(i)||Qr(i))&&this.transparent&&!this.parameters.writeDepth]]),this._vertexBufferLayout=Lu(this.parameters),this._configuration=new N(r.spherical)}isVisibleForOutput(e){return e!==j.Shadow&&e!==j.ShadowExcludeHighlight&&e!==j.ShadowHighlight||this.parameters.castShadows}get visible(){const{layerOpacity:e,colorMixMode:r,opacity:i,externalColor:o}=this.parameters;return e*(r==="replace"?1:i)*(r==="ignore"?1:o[3])>=It}get _hasEmissiveBase(){return!!this.parameters.emissiveTextureId||!qt(this.parameters.emissiveBaseColor,Ct)}get hasEmissions(){return this.parameters.emissiveStrength>0&&(this.parameters.emissiveSource===Ut.Emissive&&this._hasEmissiveBase||this.parameters.emissiveSource===Ut.Color)}getConfiguration(e,r){const{parameters:i,_configuration:o}=this,{treeRendering:a,doubleSided:n,doubleSidedType:s}=i;return super.getConfiguration(e,r,this._configuration),o.hasNormalTexture=!a&&!!i.normalTextureId,o.hasColorTexture=!!i.textureId,o.hasVertexTangents=!a&&i.hasVertexTangents,o.instanced=i.isInstanced,o.instancedDoublePrecision=i.instancedDoublePrecision,o.vvSize=!!i.vvSize,o.hasVerticalOffset=i.verticalOffset!=null,o.hasScreenSizePerspective=i.screenSizePerspective!=null,o.hasSlicePlane=i.hasSlicePlane,o.alphaDiscardMode=i.textureAlphaMode,o.normalType=a?le.Attribute:i.normalType,o.transparent=this.transparent,o.writeDepth=i.writeDepth,o.customDepthTest=i.customDepthTest??rr.Less,o.hasOccludees=r.hasOccludees,o.cullFace=i.hasSlicePlane?nt.None:i.cullFace,o.cullAboveTerrain=r.cullAboveTerrain,o.hasModelTransformation=!a&&i.modelTransformation!=null,o.hasVertexColors=i.hasVertexColors,o.hasSymbolColors=i.hasSymbolColors,o.doubleSidedMode=a?ve.WindingOrder:n&&s==="normal"?ve.View:n&&s==="winding-order"?ve.WindingOrder:ve.None,o.instancedColor=i.hasInstancedColor,Je(e)?(o.terrainDepthTest=r.terrainDepthTest,o.receiveShadows=i.receiveShadows,o.receiveAmbientOcclusion=i.receiveAmbientOcclusion&&r.ssao!=null):(o.terrainDepthTest=!1,o.receiveShadows=o.receiveAmbientOcclusion=!1),o.vvColor=!!i.vvColor,o.textureAlphaPremultiplied=!!i.textureAlphaPremultiplied,o.pbrMode=i.usePBR?i.isSchematic?L.Schematic:L.Normal:L.Disabled,o.hasMetallicRoughnessTexture=!a&&!!i.metallicRoughnessTextureId,o.emissionSource=a?me.None:i.emissiveTextureId!=null&&i.emissiveSource===Ut.Emissive?me.Texture:i.usePBR?i.emissiveSource===Ut.Emissive?me.EmissiveColor:me.SymbolColor:me.None,o.hasOcclusionTexture=!a&&!!i.occlusionTextureId,o.offsetBackfaces=!(!this.transparent||!i.offsetTransparentBackfaces),o.oitPass=r.oitPass,o.enableOffset=r.camera.relativeElevation<Ec,o.snowCover=r.snowCover,o.hasBloom=Si(e),o.hasColorTextureTransform=!!i.colorTextureTransformMatrix,o.hasNormalTextureTransform=!!i.normalTextureTransformMatrix,o.hasEmissionTextureTransform=!!i.emissiveTextureTransformMatrix,o.hasOcclusionTextureTransform=!!i.occlusionTextureTransformMatrix,o.hasMetallicRoughnessTextureTransform=!!i.metallicRoughnessTextureTransformMatrix,o}intersect(e,r,i,o,a,n){if(this.parameters.verticalOffset!=null){const s=i.camera;te(li,r[12],r[13],r[14]);let l=null;switch(i.viewingMode){case mi.Global:l=Jt(yo,li);break;case mi.Local:l=oe(yo,Gu)}let c=0;const u=De(zu,li,s.eye),h=pe(u),m=Pe(u,u,1/h);let p=null;this.parameters.screenSizePerspective&&(p=ot(l,m)),c+=Wl(s,h,this.parameters.verticalOffset,p??0,this.parameters.screenSizePerspective),Pe(l,l,c),is(si,l,i.transform.inverseRotation),o=De(Bu,o,si),a=De(Uu,a,si)}Rc(e,i,o,a,Wc(i.verticalOffset),n)}createGLMaterial(e){return new Pu(e)}createBufferWriter(){return new ed(this._vertexBufferLayout)}get transparent(){return Fu(this.parameters)}}class Pu extends hl{constructor(e){super({...e,...e.material.parameters})}beginSlot(e){this._material.setParameters({receiveShadows:e.shadowMap.enabled});const r=this._material.parameters;this.updateTexture(r.textureId);const i=e.camera.viewInverseTransposeMatrix;return te(r.origin,i[3],i[7],i[11]),this._material.setParameters(this.textureBindParameters),this.getTechnique(r.treeRendering?$u:mn,e)}}class Du extends yu{constructor(){super(...arguments),this.treeRendering=!1,this.hasVertexTangents=!1}}function Lu(t){const e=ls().vec3f(T.POSITION);return t.normalType===le.Compressed?e.vec2i16(T.NORMALCOMPRESSED,{glNormalized:!0}):e.vec3f(T.NORMAL),t.hasVertexTangents&&e.vec4f(T.TANGENT),(t.textureId||t.normalTextureId||t.metallicRoughnessTextureId||t.emissiveTextureId||t.occlusionTextureId)&&e.vec2f16(T.UV0),t.hasVertexColors&&e.vec4u8(T.COLOR),t.hasSymbolColors&&e.vec4u8(T.SYMBOLCOLOR),bs()&&e.vec4u8(T.OLIDCOLOR),e}function Fu(t){const{drivenOpacity:e,opacity:r,externalColor:[i,o,a,n],layerOpacity:s,texture:l,textureId:c,textureAlphaMode:u,colorMixMode:h}=t;return e||r<1&&h!=="replace"||n<1&&h!=="ignore"||s<1||(l!=null||c!=null)&&u!==ye.Opaque&&u!==ye.Mask&&h!=="replace"}const Bu=C(),Uu=C(),Gu=kt(0,0,1),yo=C(),si=C(),li=C(),zu=C();export{Mc as $,cn as A,Di as B,qr as C,sm as D,Yt as E,wd as F,dn as G,Du as H,Ka as I,kr as J,Au as K,Eh as L,fe as M,hm as N,It as O,Za as P,Fu as Q,Iu as R,Mh as S,ie as T,Pi as U,Wr as V,Vm as W,Hr as X,ql as Y,qh as Z,Kl as _,vl as a,Vr as a0,y as a1,xt as a2,ce as a3,me as a4,kl as a5,Xt as a6,xh as a7,fa as a8,Wh as a9,hl as aa,pl as ab,yr as ac,bs as ad,kc as ae,qc as af,Yc as ag,Jh as ah,Ia as ai,Kh as aj,Jc as ak,_m as al,Wl as am,Hh as an,oa as ao,Vh as ap,Ph as b,Wo as c,Dh as d,Sh as e,lh as f,k as g,ch as h,Xd as i,xd as j,St as k,Qt as l,ou as m,fi as n,wh as o,Re as p,We as q,Rt as r,Lh as s,Ss as t,Sd as u,Bi as v,fd as w,dm as x,_d as y,du as z};
