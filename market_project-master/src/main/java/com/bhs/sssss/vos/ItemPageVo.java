package com.bhs.sssss.vos;

public class ItemPageVo {
    public final int countPerPage = 30;  // 한 페이지에 표시할 상품 개수
    public final int requestPage;        // 클라이언트가 요청한 페이지 반환
    public final int totalCount;         // 전체 상품의 개수
    public final int displayMinPage;     // 표시할 최소 페이지 번호
    public final int displayMaxPage;     // 표시할 최대 페이지 번호
    public final int movableMaxPage;     // 이동 가능한 최대 페이지 번호
    public final int offsetCount;        // 거르는 레코드 개수

    public ItemPageVo(int requestPage, int totalCount) {
        this.requestPage = requestPage;
        this.totalCount = totalCount;
        this.movableMaxPage = totalCount / this.countPerPage + (totalCount % this.countPerPage == 0 ? 0 : 1);
        this.displayMinPage = ((requestPage - 1) / 29) * 5 + 1;
        this.displayMaxPage = Math.min(this.displayMinPage + 29, this.movableMaxPage);
        this.offsetCount = (requestPage - 1) * this.countPerPage;
    }
}
