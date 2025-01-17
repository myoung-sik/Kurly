package com.bhs.sssss.services;

import com.bhs.sssss.entities.CategoryEntity;
import com.bhs.sssss.entities.ItemEntity;
import com.bhs.sssss.entities.SubCategoryEntity;
import com.bhs.sssss.exceptions.TransactionalException;
import com.bhs.sssss.mappers.CategoryMapper;
import com.bhs.sssss.mappers.ItemMapper;
import com.bhs.sssss.mappers.SubCategoryMapper;
import com.bhs.sssss.results.CommonResult;
import com.bhs.sssss.results.Result;
import com.bhs.sssss.vos.ItemPageVo;
import org.apache.commons.lang3.tuple.Pair;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;

@Service
public class ItemService {
    private final CategoryMapper categoryMapper;
    private final SubCategoryMapper subCategoryMapper;
    private final ItemMapper itemMapper;

    @Autowired
    public ItemService(CategoryMapper categoryMapper, SubCategoryMapper subCategoryMapper, ItemMapper itemMapper) {
        this.categoryMapper = categoryMapper;
        this.subCategoryMapper = subCategoryMapper;
        this.itemMapper = itemMapper;
    }

    public CategoryEntity[] getCategories() {
        return this.categoryMapper.selectCategories();
    }

    public SubCategoryEntity[] getSubCategoriesById(String categoryId) {
        String parentId = categoryId;
        return this.subCategoryMapper.selectSubCategoriesByParentId(parentId);
    }

    public ItemEntity[] getItems() {
        return this.itemMapper.selectItems();
    }

    public Pair<ItemPageVo, ItemEntity[]> getItemsByNew(int page){
        page = Math.max(1, page);
        int totalCount = this.itemMapper.selectItemCount();
        ItemPageVo pageVo = new ItemPageVo(page, totalCount);
        ItemEntity[] items = this.itemMapper.selectItemsByNew(
                pageVo.countPerPage,
                pageVo.offsetCount
        );
        return Pair.of(pageVo, items);
    }

    public Pair<ItemPageVo, ItemEntity[]> getItemsBySticker(int page){
        page = Math.max(1, page);
        int totalCount = this.itemMapper.selectItemCount1();
        ItemPageVo pageVo = new ItemPageVo(page, totalCount);
        ItemEntity[] items = this.itemMapper.selectItemsBySticker(
                pageVo.countPerPage,
                pageVo.offsetCount
        );
        return Pair.of(pageVo, items);
    }

    public Pair<ItemPageVo, ItemEntity[]> getItemsByDiscount(int page){
        page = Math.max(1, page);
        int totalCount = this.itemMapper.selectItemCount2();
        ItemPageVo pageVo = new ItemPageVo(page, totalCount);
        ItemEntity[] items = this.itemMapper.selectItemsByDiscount(
                pageVo.countPerPage,
                pageVo.offsetCount
        );
        return Pair.of(pageVo, items);
    }

    public Pair<ItemPageVo, ItemEntity[]> getItemsByKeyword(int page, String keyword){
        page = Math.max(1, page);
        int totalCount = this.itemMapper.selectItemCountByKeyword(keyword);
        ItemPageVo pageVo = new ItemPageVo(page, totalCount);
        ItemEntity[] items = this.itemMapper.selectItemsByKeyword(
                keyword,
                pageVo.countPerPage,
                pageVo.offsetCount
        );
        return Pair.of(pageVo, items);
    }

    @Transactional
    public ItemEntity crawlAndSaveKurly(String itemId) throws IOException {
        if (itemId == null || itemId.isEmpty()) {
            return null;
        }
        String url = String.format("https://www.kurly.com/goods/%s", itemId);
        Document document = Jsoup.connect(url).get();

        ItemEntity item = new ItemEntity();
        item.setItemId(itemId);
        Elements $itemImage = document.select("img[src^=\"https://img-cf.kurly.com/hdims/resize/%5E%3E720x%3E936/cropcenter/720x936/quality/85/src/shop/data/goods/\"], img[src^=\"https://product-image.kurly.com/hdims/resize/%5E%3E720x%3E936/cropcenter/720x936/quality/85/src/product/image/\"]");
        Elements $sticker = document.select("img[src^=\"https://product-image.kurly.com/sticker/image/\"]");
        Elements $title = document.select("h1.css-3eizrx.ezpe9l11");
        Elements $subTitle = document.select("h2.css-1q0tnnd.ezpe9l10");
        Elements $discountRate = document.select("span.css-5nirzt.e1q8tigr3");
        Elements $salesPrice = document.select("span.css-9pf1ze.e1q8tigr2");
        Elements $price = document.select("span.css-1e1rd4p.e1q8tigr0");
        Elements $delivery = document.select("li.css-e6zlnr:has(dt:contains(배송)) p.css-c02hqi.e6qx2kx1");
        Elements $seller = document.select("li.css-e6zlnr:has(dt:contains(판매자)) p.css-c02hqi.e6qx2kx1");
        Elements $packaging = document.select("li.css-e6zlnr:has(dt:contains(포장타입)) p.css-c02hqi.e6qx2kx1");
        Elements $detailImage = document.select("div.goods_intro img[src^=\"https://img-cf.kurly.com/hdims/resize/%3E1010x/quality/90/src/shop/data/goodsview/\"]");
        Elements $words = document.select("p.words");
        Elements $kurlyCheck = document.select("div.context.last img[src^=\"https://img-cf.kurly.com/hdims/resize/%3E1010x/quality/90/src/shop/data/goodsview/\"]");
        Elements $detailInfo = document.select("div.css-kqvkc7.es6jciw1 img[src^=\"https://img-cf.kurly.com/hdims/resize/%3E1010x/quality/90/src/shop/data/goodsview/\"]");

        item.setImageUrl($itemImage.attr("src"));
        item.setSticker($sticker.attr("src"));
        item.setItemTitle($title.text());
        item.setSubTitle($subTitle.text());
        item.setDiscountRate($discountRate.text());
        item.setSalesPrice($salesPrice.text());
        item.setPrice($price.text().replace("원", ""));
        item.setDelivery($delivery.text());
        item.setSeller($seller.text());
        item.setPackaging($packaging.text());
        item.setDetailImage($detailImage.attr("src"));
        item.setWords($words.text());
        item.setKurlyCheck($kurlyCheck.attr("src"));
        item.setIsManual(false);
        item.setDetailInfo($detailInfo.attr("src"));

        // DB에 데이터 삽입

        if (this.itemMapper.insertItem(item) == 0) {
            throw new TransactionalException();
        }

        return item;
    }

    public Result saveManualItem(ItemEntity itemEntity) {
        if (itemEntity == null) {
            return CommonResult.FAILURE;
        }

        itemEntity.setIsManual(true);
        int rowsInserted = itemMapper.insertItem(itemEntity);
        return rowsInserted > 0 ? CommonResult.SUCCESS : CommonResult.FAILURE;
    }

    public List<ItemEntity> getAllItems() {
        return itemMapper.selectAllItems();
    }

    public ItemEntity getItemByIndex(int index) {
        return itemMapper.selectItemByIndex(index);
    }

    public ItemEntity getItemByItemId(String itemId) {
        return itemMapper.selectItemByItemId(itemId);
    }


}
