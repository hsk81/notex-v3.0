export type JQueryEx<T = HTMLElement> = Omit<JQuery, 'button'> & {
    button: (action: string) => JQueryEx<T>;
};
export class Ui {
    public static get me(): Ui {
        if (window.UI === undefined) {
            window.UI = new Ui();
        }
        return window.UI;
    }
    public get $document() {
        return $(document);
    }
    ///////////////////////////////////////////////////////////////////////////
    // .lhs
    ///////////////////////////////////////////////////////////////////////////
    public get $lhs() {
        return $('.lhs');
    }
    public get $lhsToolbarOuter() {
        return this.$lhs.find('>.toolbar-outer');
    }
    public get $lhsToolbarInner() {
        return this.$lhsToolbarOuter.find('>.toolbar-inner');
    }
    public get $lhsToolbar() {
        return this.$lhsToolbarInner.find('>.md-toolbar');
    }
    public get $input() {
        return this.$lhs.find('#input');
    }
    public get $footer() {
        return this.$input.siblings('.footer');
    }
    public get $footerMirror() {
        return this.$footer.find('.glyphicon-console').closest('button');
    }
    public get $footerCli() {
        return this.$footer.find('#cli');
    }
    public get $footerCliFind() {
        return this.$footerCli.find('input.find');
    }
    public get $footerCliFindNext() {
        return this.$footerCli.find('.find-next');
    }
    public get $footerCliFindPrevious() {
        return this.$footerCli.find('.find-previous');
    }
    public get $footerCliReplace() {
        return this.$footerCli.find('input.replace');
    }
    public get $footerCliReplaceConfirm() {
        return this.$footerCli.find('.replace-confirm');
    }
    public get $footerSpellCheckerButton() {
        return this.$footer.find('#spell-checker-button');
    }
    public get $footerSpellCheckerMenu() {
        return this.$footer.find('ul#spell-checker-menu');
    }
    public get $footerSpellCheckerToggle() {
        return this.$footerSpellCheckerMenu.find('li:first-of-type');
    }
    public get $footerSpellCheckerItem() {
        return this.$footerSpellCheckerMenu.find('li:not(:first-of-type)');
    }
    ///////////////////////////////////////////////////////////////////////////
    // .rhs
    ///////////////////////////////////////////////////////////////////////////
    public get $rhs() {
        return $('.rhs');
    }
    public get $rhsToolbarOuter() {
        return this.$rhs.find('>.toolbar-outer');
    }
    public get $rhsToolbarInner() {
        return this.$rhsToolbarOuter.find('>.toolbar-inner');
    }
    public get $rhsToolbar() {
        return this.$rhsToolbarInner.find('>.md-toolbar');
    }
    public get $viewer() {
        if (this.$cached.css('visibility') !== 'hidden') {
            return this.$cached;
        } else {
            return this.$output;
        }
    }
    public get $viewerContents() {
        return this.$viewer.contents();
    }
    public get $cached() {
        return this.$rhs.find('#cached') as JQuery<HTMLFrameElement>;
    }
    public set $cached($element: JQuery<HTMLFrameElement>) {
        this.$cached.remove();
        this.$rhs.prepend($element);
    }
    public get $cachedHead() {
        return this.$cached.contents().find('head');
    }
    public get $cachedBody() {
        return this.$cached.contents().find('body');
    }
    public get $output() {
        return this.$rhs.find('#output') as JQuery<HTMLFrameElement>;
    }
    public set $output($element: JQuery<HTMLFrameElement>) {
        this.$output.remove();
        this.$rhs.prepend($element);
    }
    public get $outputHead() {
        return this.$output.contents().find('head');
    }
    public get $outputBody() {
        return this.$output.contents().find('body');
    }
    public get $aibar() {
        return this.$rhs.find('.aibar');
    }
    public get $aibarLhsButton() {
        return this.$aibar.find('button.ai-lhs');
    }
    public get $aibarMidButton() {
        return this.$aibar.find('button.ai-mid');
    }
    public get $aibarRhsButton() {
        return this.$aibar.find('button.ai-rhs');
    }
    ///////////////////////////////////////////////////////////////////////////
    // .any
    ///////////////////////////////////////////////////////////////////////////
    public get $anyToolbarOuter() {
        return $('.toolbar-outer');
    }
    public get $anyToolbarInner() {
        return this.$anyToolbarOuter.find('>.toolbar-inner');
    }
    public get $anyToolbar() {
        return this.$anyToolbarInner.find('>.md-toolbar');
    }
    public get $toolOpen() {
        return this.$anyToolbar.find('#source-bar,#source-mob');
    }
    public get $toolSave() {
        return this.$anyToolbar.find('a[name=save]');
    }
    public get $toolSwap() {
        return this.$anyToolbar.find('[name=swap]');
    }
    public get $toolBold() {
        return this.$anyToolbar.find('.glyphicon-bold').closest('button');
    }
    public get $toolCopy() {
        return this.$anyToolbar.find('.glyphicon-copy').closest('button');
    }
    public get $toolCut() {
        return this.$anyToolbar.find('.glyphicon-scissors').closest('button');
    }
    public get $toolHeader() {
        return this.$anyToolbar.find('.glyphicon-header').closest('button');
    }
    public get $toolErase() {
        return this.$anyToolbar.find('.glyphicon-erase').closest('button');
    }
    public get $toolFont() {
        return this.$anyToolbar.find('.glyphicon-font').closest('button');
    }
    public get $toolIndent() {
        return this.$anyToolbar.find('.glyphicon-indent-left').closest('button');
    }
    public get $toolItalic() {
        return this.$anyToolbar.find('.glyphicon-italic').closest('button');
    }
    public get $toolLink() {
        return this.$anyToolbar.find('.glyphicon-link').closest('button');
    }
    public get $toolImage() {
        return this.$anyToolbar.find('.glyphicon-picture').closest('button');
    }
    public get $toolVideo() {
        return this.$anyToolbar.find('.glyphicon-film').closest('button');
    }
    public get $toolOutdent() {
        return this.$anyToolbar.find('.glyphicon-indent-right').closest('button');
    }
    public get $toolPaste() {
        return this.$anyToolbar.find('.glyphicon-paste').closest('button');
    }
    public get $toolProduct() {
        return this.$anyToolbar.find('.glyphicon.product').closest('button');
    }
    public get $toolRedo() {
        return this.$anyToolbar.find('.glyphicon.redo').closest('button');
    }
    public get $toolSubscript() {
        return this.$anyToolbar.find('.glyphicon-subscript').closest('button');
    }
    public get $toolSupscript() {
        return this.$anyToolbar.find('.glyphicon-superscript').closest('button');
    }
    public get $toolSum() {
        return this.$anyToolbar.find('.glyphicon.sum').closest('button');
    }
    public get $toolUndo() {
        return this.$anyToolbar.find('.glyphicon.undo').closest('button');
    }
    public get $toolPrint() {
        return this.$anyToolbar.find('.glyphicon.print').closest('button');
    }
    public get $toolPublish() {
        return this.$anyToolbar.find('.glyphicon.publish').closest('button');
    }
    public get $toolRefresh() {
        return this.$anyToolbar.find('.glyphicon.refresh').closest('button');
    }
    public get $toolTemplate() {
        return this.$anyToolbar.find('.glyphicon.template').closest('button');
    }
    public get $tool1Column() {
        return this.$anyToolbar.find('.glyphicon.1-column').closest('button');
    }
    public get $tool2Columns() {
        return this.$anyToolbar.find('.glyphicon.2-column').closest('button');
    }
    public get $tool3Columns() {
        return this.$anyToolbar.find('.glyphicon.3-column').closest('button');
    }
    ///////////////////////////////////////////////////////////////////////////
    // #publish-dlg
    ///////////////////////////////////////////////////////////////////////////
    public get $publishDialog() {
        return $('#publish-dlg');
    }
    public get $publishDialogBlogNav() {
        return this.$publishDialog.find('.nav-blog');
    }
    public get $publishDialogBlogTab() {
        return this.$publishDialog.find('.tab-blog');
    }
    public get $publishDialogBlogUrl() {
        return this.$publishDialog.find('#blog-url');
    }
    public get $publishDialogBlogTitle() {
        return this.$publishDialog.find('#post-title');
    }
    public get $publishDialogBlogSettings() {
        return this.$publishDialog.find('.post-settings');
    }
    public get $publishDialogBlogSettingsNav() {
        return this.$publishDialog.find('.post-settings.nav');
    }
    public get $publishDialogBlogScripts() {
        return this.$publishDialog.find('.post-settings.scripts');
    }
    public get $publishDialogBlogScriptsNav() {
        return this.$publishDialogBlogSettingsNav.find('.scripts');
    }
    public get $publishDialogBlogScriptsCheckbox() {
        return this.$publishDialogBlogScripts.find('[type=checkbox]');
    }
    public get $publishDialogBlogScriptsTextarea() {
        return this.$publishDialogBlogScripts.find('textarea');
    }
    public get $publishDialogBlogStyles() {
        return this.$publishDialog.find('.post-settings.styles');
    }
    public get $publishDialogBlogStylesNav() {
        return this.$publishDialogBlogSettingsNav.find('.styles');
    }
    public get $publishDialogBlogStylesCheckbox() {
        return this.$publishDialogBlogStyles.find('[type=checkbox]');
    }
    public get $publishDialogBlogStylesTextarea() {
        return this.$publishDialogBlogStyles.find('textarea');
    }
    public get $publishDialogIpfsNav() {
        return this.$publishDialog.find('.nav-ipfs');
    }
    public get $publishDialogIpfsTab() {
        return this.$publishDialog.find('.tab-ipfs');
    }
    public get $publishDialogIpfsGateway() {
        return this.$publishDialog.find('#ipfs-gateway');
    }
    public get $publishDialogIpfsGatewayIg() {
        return this.$publishDialogIpfsGateway.parent('.input-group');
    }
    public get $publishDialogExpand() {
        return this.$publishDialog.find('#expand');
    }
    public get $publishDialogPrimary() {
        return this.$publishDialog.find('.btn-primary') as JQueryEx<HTMLButtonElement>;
    }
    ///////////////////////////////////////////////////////////////////////////
    // #template-dlg
    ///////////////////////////////////////////////////////////////////////////
    public get $templateDialog() {
        return $('#template-dlg');
    }
    public get $templateDialogItem() {
        return this.$templateDialog.find('a.list-group-item');
    }
    public get $templateDialogItemActive() {
        return this.$templateDialog.find('a.list-group-item.active');
    }
    public get $templateDialogPrimary() {
        return this.$templateDialog.find('.btn-primary') as JQueryEx<HTMLButtonElement>;
    }
}
export default Ui;
