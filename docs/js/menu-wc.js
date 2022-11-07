'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">book-store documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-5341284ef7fd7dbe60e5567181b80964caffa840195d331b1ce6567f94d6fa009788c6ecd302eb22ac49a1fa6ba76ed039ec791469a54a09c4260f45d33a306c"' : 'data-target="#xs-controllers-links-module-AppModule-5341284ef7fd7dbe60e5567181b80964caffa840195d331b1ce6567f94d6fa009788c6ecd302eb22ac49a1fa6ba76ed039ec791469a54a09c4260f45d33a306c"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-5341284ef7fd7dbe60e5567181b80964caffa840195d331b1ce6567f94d6fa009788c6ecd302eb22ac49a1fa6ba76ed039ec791469a54a09c4260f45d33a306c"' :
                                            'id="xs-controllers-links-module-AppModule-5341284ef7fd7dbe60e5567181b80964caffa840195d331b1ce6567f94d6fa009788c6ecd302eb22ac49a1fa6ba76ed039ec791469a54a09c4260f45d33a306c"' }>
                                            <li class="link">
                                                <a href="controllers/BookController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BookController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/MemberController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MemberController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/BookConfigModule.html" data-type="entity-link" >BookConfigModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/BookElasticModule.html" data-type="entity-link" >BookElasticModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/BookJWTTokenModule.html" data-type="entity-link" >BookJWTTokenModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/BookModule.html" data-type="entity-link" >BookModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/BookRedisModule.html" data-type="entity-link" >BookRedisModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MemberModule.html" data-type="entity-link" >MemberModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Authorizer.html" data-type="entity-link" >Authorizer</a>
                            </li>
                            <li class="link">
                                <a href="classes/BookException.html" data-type="entity-link" >BookException</a>
                            </li>
                            <li class="link">
                                <a href="classes/BookExceptionFilter.html" data-type="entity-link" >BookExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/BookService.html" data-type="entity-link" >BookService</a>
                            </li>
                            <li class="link">
                                <a href="classes/CheckoutDto.html" data-type="entity-link" >CheckoutDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContentDto.html" data-type="entity-link" >ContentDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetContentQuery.html" data-type="entity-link" >GetContentQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/ISelectContent.html" data-type="entity-link" >ISelectContent</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDto.html" data-type="entity-link" >LoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/MemberService.html" data-type="entity-link" >MemberService</a>
                            </li>
                            <li class="link">
                                <a href="classes/Path.html" data-type="entity-link" >Path</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterDto.html" data-type="entity-link" >RegisterDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SelectContentDto.html" data-type="entity-link" >SelectContentDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SettingPointDto.html" data-type="entity-link" >SettingPointDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/BookServiceImpl.html" data-type="entity-link" >BookServiceImpl</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MemberServiceImpl.html" data-type="entity-link" >MemberServiceImpl</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AccessTokenResponse.html" data-type="entity-link" >AccessTokenResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ContentResponse.html" data-type="entity-link" >ContentResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAppConfig.html" data-type="entity-link" >IAppConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IContent.html" data-type="entity-link" >IContent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IElasticConfig.html" data-type="entity-link" >IElasticConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IJWTConfig.html" data-type="entity-link" >IJWTConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMember.html" data-type="entity-link" >IMember</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRedisConfig.html" data-type="entity-link" >IRedisConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISettingPoint.html" data-type="entity-link" >ISettingPoint</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITokenPayload.html" data-type="entity-link" >ITokenPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITransaction.html" data-type="entity-link" >ITransaction</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MemberResponse.html" data-type="entity-link" >MemberResponse</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});