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
                    <a href="index.html" data-type="index-link">workflow documentation</a>
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
                    <li class="chapter additional">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#additional-pages"'
                            : 'data-target="#xs-additional-pages"' }>
                            <span class="icon ion-ios-book"></span>
                            <span>Additional documentation</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="additional-pages"' : 'id="xs-additional-pages"' }>
                                    <li class="link ">
                                        <a href="additional-documentation/architecture.html" data-type="entity-link" data-context-id="additional">Architecture</a>
                                    </li>
                                    <li class="link ">
                                        <a href="additional-documentation/localization.html" data-type="entity-link" data-context-id="additional">Localization</a>
                                    </li>
                                    <li class="link ">
                                        <a href="additional-documentation/continuos-integration.html" data-type="entity-link" data-context-id="additional">Continuos integration</a>
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
                                            'data-target="#components-links-module-AppModule-5b7afa15ab904833811d4d1614b9d8615c0922f76ba9eaaa1af026e20a3959f0cc29f64c303b7f4497338aa51069579b717b48baabb320c022494afc15cce099"' : 'data-target="#xs-components-links-module-AppModule-5b7afa15ab904833811d4d1614b9d8615c0922f76ba9eaaa1af026e20a3959f0cc29f64c303b7f4497338aa51069579b717b48baabb320c022494afc15cce099"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-5b7afa15ab904833811d4d1614b9d8615c0922f76ba9eaaa1af026e20a3959f0cc29f64c303b7f4497338aa51069579b717b48baabb320c022494afc15cce099"' :
                                            'id="xs-components-links-module-AppModule-5b7afa15ab904833811d4d1614b9d8615c0922f76ba9eaaa1af026e20a3959f0cc29f64c303b7f4497338aa51069579b717b48baabb320c022494afc15cce099"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LandingPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LandingPageComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AuthModule-484eb7b64ccab9a5180a658e49d4cd026f8494cd608bba5ba1f611366ce2ad68695237348b06ccf41e346b3a22507be39d567dadb6dd80db0057621a2e391c2b"' : 'data-target="#xs-components-links-module-AuthModule-484eb7b64ccab9a5180a658e49d4cd026f8494cd608bba5ba1f611366ce2ad68695237348b06ccf41e346b3a22507be39d567dadb6dd80db0057621a2e391c2b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AuthModule-484eb7b64ccab9a5180a658e49d4cd026f8494cd608bba5ba1f611366ce2ad68695237348b06ccf41e346b3a22507be39d567dadb6dd80db0057621a2e391c2b"' :
                                            'id="xs-components-links-module-AuthModule-484eb7b64ccab9a5180a658e49d4cd026f8494cd608bba5ba1f611366ce2ad68695237348b06ccf41e346b3a22507be39d567dadb6dd80db0057621a2e391c2b"' }>
                                            <li class="link">
                                                <a href="components/ChangePasswordPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChangePasswordPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DeleteAccountPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeleteAccountPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ForgotPasswordPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ForgotPasswordPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegisterPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RestoreAccountPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RestoreAccountPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthRoutingModule.html" data-type="entity-link" >AuthRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/DashboardModule.html" data-type="entity-link" >DashboardModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-DashboardModule-55dda6c8a024c4eb80d3dd9d6444efe920c28b74d0f40d77dc0f7eb83a24d496e41487840a42b4b42d51045b6f3d6b0155fa880b03c09985c5d184e2bd24f77d"' : 'data-target="#xs-components-links-module-DashboardModule-55dda6c8a024c4eb80d3dd9d6444efe920c28b74d0f40d77dc0f7eb83a24d496e41487840a42b4b42d51045b6f3d6b0155fa880b03c09985c5d184e2bd24f77d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-DashboardModule-55dda6c8a024c4eb80d3dd9d6444efe920c28b74d0f40d77dc0f7eb83a24d496e41487840a42b4b42d51045b6f3d6b0155fa880b03c09985c5d184e2bd24f77d"' :
                                            'id="xs-components-links-module-DashboardModule-55dda6c8a024c4eb80d3dd9d6444efe920c28b74d0f40d77dc0f7eb83a24d496e41487840a42b4b42d51045b6f3d6b0155fa880b03c09985c5d184e2bd24f77d"' }>
                                            <li class="link">
                                                <a href="components/AddMemberDialog.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddMemberDialog</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateProjectMembersPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateProjectMembersPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateProjectPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateProjectPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateWorkspacePage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateWorkspacePage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditProjectMembersPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditProjectMembersPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditProjectPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditProjectPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditWorkspacePage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditWorkspacePage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/IntegrationGithubComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IntegrationGithubComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MemberListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MemberListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProjectsListPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectsListPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ViewOptionsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ViewOptionsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WorkspacesListPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WorkspacesListPage</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-DashboardModule-55dda6c8a024c4eb80d3dd9d6444efe920c28b74d0f40d77dc0f7eb83a24d496e41487840a42b4b42d51045b6f3d6b0155fa880b03c09985c5d184e2bd24f77d"' : 'data-target="#xs-injectables-links-module-DashboardModule-55dda6c8a024c4eb80d3dd9d6444efe920c28b74d0f40d77dc0f7eb83a24d496e41487840a42b4b42d51045b6f3d6b0155fa880b03c09985c5d184e2bd24f77d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-DashboardModule-55dda6c8a024c4eb80d3dd9d6444efe920c28b74d0f40d77dc0f7eb83a24d496e41487840a42b4b42d51045b6f3d6b0155fa880b03c09985c5d184e2bd24f77d"' :
                                        'id="xs-injectables-links-module-DashboardModule-55dda6c8a024c4eb80d3dd9d6444efe920c28b74d0f40d77dc0f7eb83a24d496e41487840a42b4b42d51045b6f3d6b0155fa880b03c09985c5d184e2bd24f77d"' }>
                                        <li class="link">
                                            <a href="injectables/GitIntegrationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GitIntegrationService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DashboardRoutingModule.html" data-type="entity-link" >DashboardRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/EmailsModule.html" data-type="entity-link" >EmailsModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/EmailsRoutingModule.html" data-type="entity-link" >EmailsRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MainModule.html" data-type="entity-link" >MainModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MessagesModule.html" data-type="entity-link" >MessagesModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MessagesRoutingModule.html" data-type="entity-link" >MessagesRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SettingsModule.html" data-type="entity-link" >SettingsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SettingsModule-af979deb5e9f78b21aafb6c7bcaa0c569bae0abb94fc950fedb7fdfda889efcbc0d376243b732e352b60abe23f36bd9e29477e6ef7268ee68aee3db8c89263bc"' : 'data-target="#xs-components-links-module-SettingsModule-af979deb5e9f78b21aafb6c7bcaa0c569bae0abb94fc950fedb7fdfda889efcbc0d376243b732e352b60abe23f36bd9e29477e6ef7268ee68aee3db8c89263bc"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SettingsModule-af979deb5e9f78b21aafb6c7bcaa0c569bae0abb94fc950fedb7fdfda889efcbc0d376243b732e352b60abe23f36bd9e29477e6ef7268ee68aee3db8c89263bc"' :
                                            'id="xs-components-links-module-SettingsModule-af979deb5e9f78b21aafb6c7bcaa0c569bae0abb94fc950fedb7fdfda889efcbc0d376243b732e352b60abe23f36bd9e29477e6ef7268ee68aee3db8c89263bc"' }>
                                            <li class="link">
                                                <a href="components/IntegrationEntryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IntegrationEntryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListGroupComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListGroupComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SettingsAccountPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SettingsAccountPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SettingsIntegrationsPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SettingsIntegrationsPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SettingsLocalizationPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SettingsLocalizationPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SettingsPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SettingsPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SettingsSessionsPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SettingsSessionsPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SettingsRoutingModule.html" data-type="entity-link" >SettingsRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/TasksModule.html" data-type="entity-link" >TasksModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TasksModule-da716c7dc24da4262a0c5b425fa572cbdfa879fed8775f01c3a5434cf05568595adfeeaafc66809fefcf89f5864b18961f039fb667136ee9fc77d5d5f18f4ef3"' : 'data-target="#xs-components-links-module-TasksModule-da716c7dc24da4262a0c5b425fa572cbdfa879fed8775f01c3a5434cf05568595adfeeaafc66809fefcf89f5864b18961f039fb667136ee9fc77d5d5f18f4ef3"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TasksModule-da716c7dc24da4262a0c5b425fa572cbdfa879fed8775f01c3a5434cf05568595adfeeaafc66809fefcf89f5864b18961f039fb667136ee9fc77d5d5f18f4ef3"' :
                                            'id="xs-components-links-module-TasksModule-da716c7dc24da4262a0c5b425fa572cbdfa879fed8775f01c3a5434cf05568595adfeeaafc66809fefcf89f5864b18961f039fb667136ee9fc77d5d5f18f4ef3"' }>
                                            <li class="link">
                                                <a href="components/BoardPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BoardPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BoardTaskComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BoardTaskComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InputAssigneeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InputAssigneeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SchedulePage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SchedulePage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StatusLabelComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StatusLabelComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TaskDialog.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TaskDialog</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TaskListPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TaskListPage</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-TasksModule-da716c7dc24da4262a0c5b425fa572cbdfa879fed8775f01c3a5434cf05568595adfeeaafc66809fefcf89f5864b18961f039fb667136ee9fc77d5d5f18f4ef3"' : 'data-target="#xs-pipes-links-module-TasksModule-da716c7dc24da4262a0c5b425fa572cbdfa879fed8775f01c3a5434cf05568595adfeeaafc66809fefcf89f5864b18961f039fb667136ee9fc77d5d5f18f4ef3"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-TasksModule-da716c7dc24da4262a0c5b425fa572cbdfa879fed8775f01c3a5434cf05568595adfeeaafc66809fefcf89f5864b18961f039fb667136ee9fc77d5d5f18f4ef3"' :
                                            'id="xs-pipes-links-module-TasksModule-da716c7dc24da4262a0c5b425fa572cbdfa879fed8775f01c3a5434cf05568595adfeeaafc66809fefcf89f5864b18961f039fb667136ee9fc77d5d5f18f4ef3"' }>
                                            <li class="link">
                                                <a href="pipes/StatusColorPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StatusColorPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/TaskPriorityIconPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TaskPriorityIconPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/TaskPriorityPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TaskPriorityPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/TaskTypeIconPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TaskTypeIconPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/TaskTypePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TaskTypePipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TasksRoutingModule.html" data-type="entity-link" >TasksRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AlertDialog.html" data-type="entity-link" >AlertDialog</a>
                            </li>
                            <li class="link">
                                <a href="components/ButtonComponent.html" data-type="entity-link" >ButtonComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CardComponent.html" data-type="entity-link" >CardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CheckboxComponent.html" data-type="entity-link" >CheckboxComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ControlAccessor.html" data-type="entity-link" >ControlAccessor</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogOutletComponent.html" data-type="entity-link" >DialogOutletComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FiltersComponent.html" data-type="entity-link" >FiltersComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GithubIntegrationPage.html" data-type="entity-link" >GithubIntegrationPage</a>
                            </li>
                            <li class="link">
                                <a href="components/IconComponent.html" data-type="entity-link" >IconComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/InputComponent.html" data-type="entity-link" >InputComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/InputDateTimeComponent.html" data-type="entity-link" >InputDateTimeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MainViewComponent.html" data-type="entity-link" >MainViewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MockPage.html" data-type="entity-link" >MockPage</a>
                            </li>
                            <li class="link">
                                <a href="components/NavElementComponent.html" data-type="entity-link" >NavElementComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NavElementWorkspaceComponent.html" data-type="entity-link" >NavElementWorkspaceComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OptionComponent.html" data-type="entity-link" >OptionComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SelectComponent.html" data-type="entity-link" >SelectComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SidebarNavigationComponent.html" data-type="entity-link" >SidebarNavigationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SnackbarComponent.html" data-type="entity-link" >SnackbarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SnackbarOutletComponent.html" data-type="entity-link" >SnackbarOutletComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TextareaComponent.html" data-type="entity-link" >TextareaComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UpperNavigationComponent.html" data-type="entity-link" >UpperNavigationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ViewOptionsComponent-1.html" data-type="entity-link" >ViewOptionsComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#directives-links"' :
                                'data-target="#xs-directives-links"' }>
                                <span class="icon ion-md-code-working"></span>
                                <span>Directives</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"' }>
                                <li class="link">
                                    <a href="directives/ClickStopPropagationDirective.html" data-type="entity-link" >ClickStopPropagationDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/FocusInitialDirective.html" data-type="entity-link" >FocusInitialDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/LetDirective.html" data-type="entity-link" >LetDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/ViewContainerDirective.html" data-type="entity-link" >ViewContainerDirective</a>
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
                                <a href="classes/DialogRef.html" data-type="entity-link" >DialogRef</a>
                            </li>
                            <li class="link">
                                <a href="classes/Emoji.html" data-type="entity-link" >Emoji</a>
                            </li>
                            <li class="link">
                                <a href="classes/Enum.html" data-type="entity-link" >Enum</a>
                            </li>
                            <li class="link">
                                <a href="classes/ESet.html" data-type="entity-link" >ESet</a>
                            </li>
                            <li class="link">
                                <a href="classes/Filters.html" data-type="entity-link" >Filters</a>
                            </li>
                            <li class="link">
                                <a href="classes/FormControlStoryPageConfig.html" data-type="entity-link" >FormControlStoryPageConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/Marked.html" data-type="entity-link" >Marked</a>
                            </li>
                            <li class="link">
                                <a href="classes/Monaco.html" data-type="entity-link" >Monaco</a>
                            </li>
                            <li class="link">
                                <a href="classes/MonacoExtended.html" data-type="entity-link" >MonacoExtended</a>
                            </li>
                            <li class="link">
                                <a href="classes/PersistentMap.html" data-type="entity-link" >PersistentMap</a>
                            </li>
                            <li class="link">
                                <a href="classes/Random.html" data-type="entity-link" >Random</a>
                            </li>
                            <li class="link">
                                <a href="classes/SelectionEditPlugin.html" data-type="entity-link" >SelectionEditPlugin</a>
                            </li>
                            <li class="link">
                                <a href="classes/Story.html" data-type="entity-link" >Story</a>
                            </li>
                            <li class="link">
                                <a href="classes/StoryPageConfig.html" data-type="entity-link" >StoryPageConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/StoryTemplate.html" data-type="entity-link" >StoryTemplate</a>
                            </li>
                            <li class="link">
                                <a href="classes/TestNgControl.html" data-type="entity-link" >TestNgControl</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserUtils.html" data-type="entity-link" >UserUtils</a>
                            </li>
                            <li class="link">
                                <a href="classes/Utils.html" data-type="entity-link" >Utils</a>
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
                                    <a href="injectables/ApiService.html" data-type="entity-link" >ApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DialogService.html" data-type="entity-link" >DialogService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MemberService.html" data-type="entity-link" >MemberService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProjectService.html" data-type="entity-link" >ProjectService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RouterExtensionsService.html" data-type="entity-link" >RouterExtensionsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SessionsService.html" data-type="entity-link" >SessionsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SnackbarService.html" data-type="entity-link" >SnackbarService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StatusService.html" data-type="entity-link" >StatusService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TaskService.html" data-type="entity-link" >TaskService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WorkspaceService.html" data-type="entity-link" >WorkspaceService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interceptors-links"' :
                            'data-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/ErrorInterceptor.html" data-type="entity-link" >ErrorInterceptor</a>
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
                                <a href="guards/LoggedInUsersGuard.html" data-type="entity-link" >LoggedInUsersGuard</a>
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
                                <a href="interfaces/AddMemberDialogData.html" data-type="entity-link" >AddMemberDialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AlertDialogData.html" data-type="entity-link" >AlertDialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EmojiToken.html" data-type="entity-link" >EmojiToken</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ErrorValidationTree.html" data-type="entity-link" >ErrorValidationTree</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExtendedMeta.html" data-type="entity-link" >ExtendedMeta</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FilterCheckbox.html" data-type="entity-link" >FilterCheckbox</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GitAccount.html" data-type="entity-link" >GitAccount</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GitAccountWithUsage.html" data-type="entity-link" >GitAccountWithUsage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GitIntegration.html" data-type="entity-link" >GitIntegration</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GitIssue.html" data-type="entity-link" >GitIssue</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GitPull.html" data-type="entity-link" >GitPull</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GitRepository.html" data-type="entity-link" >GitRepository</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LetContext.html" data-type="entity-link" >LetContext</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ModifyUser.html" data-type="entity-link" >ModifyUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PersistentMapOptions.html" data-type="entity-link" >PersistentMapOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Project.html" data-type="entity-link" >Project</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProjectMember.html" data-type="entity-link" >ProjectMember</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RequestOptions.html" data-type="entity-link" >RequestOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SelectionEditOperation.html" data-type="entity-link" >SelectionEditOperation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SinglePersonSchedule.html" data-type="entity-link" >SinglePersonSchedule</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SnackbarData.html" data-type="entity-link" >SnackbarData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Status.html" data-type="entity-link" >Status</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StatusWithTasks.html" data-type="entity-link" >StatusWithTasks</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StoryConfig.html" data-type="entity-link" >StoryConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Task.html" data-type="entity-link" >Task</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TaskDialogData.html" data-type="entity-link" >TaskDialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TaskWithAdditionalData.html" data-type="entity-link" >TaskWithAdditionalData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TemplateDecoratorConfig.html" data-type="entity-link" >TemplateDecoratorConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserData.html" data-type="entity-link" >UserData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserSession.html" data-type="entity-link" >UserSession</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserWithPrivileges.html" data-type="entity-link" >UserWithPrivileges</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ValidationError.html" data-type="entity-link" >ValidationError</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Workspace.html" data-type="entity-link" >Workspace</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#pipes-links"' :
                                'data-target="#xs-pipes-links"' }>
                                <span class="icon ion-md-add"></span>
                                <span>Pipes</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"' }>
                                <li class="link">
                                    <a href="pipes/ValidationErrorPipe.html" data-type="entity-link" >ValidationErrorPipe</a>
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
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
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