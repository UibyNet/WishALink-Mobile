import {Component, NgZone, OnInit} from '@angular/core';
import { PostApiService, PostListModel, SocialUserListModel } from 'src/app/services/api.service';
import {AppService} from "../../../services/app.service";

@Component({
    selector: 'app-suggestion',
    templateUrl: './suggestion.page.html',
    styleUrls: ['./suggestion.page.scss'],
})
export class SuggestionPage implements OnInit {

    userData: SocialUserListModel
    suggestions: PostListModel[];

    constructor(
        private zone: NgZone,
        private appService: AppService,
        private postApiService: PostApiService
    ) {
    }
    ngOnInit() {
        this.userData = this.appService.userInfo;

        this.loadSuggestions()
    }
    loadSuggestions() {
        this.postApiService.suggestions()
            .subscribe(
                v => this.onSuggestionsLoad(v),
                e => this.onError(e)
            )
    }
    onSuggestionsLoad(v: PostListModel[]): void {
        this.zone.run(()=>{
            if(this.suggestions == null) this.suggestions = [];
            this.suggestions = this.suggestions.concat(v);
        })
    }
    onError(e: any): void {
        this.appService.showErrorAlert(e);
    }

}
