# -*- encoding:utf-8 -*-
# !user/bin/env python

import re
import bs4
import requests
import csv
import time

urlRoot = "http://bj.58.com"


def GetUrlList(urlMainPage, headers):
    print "##############"+" "+urlMainPage + " " + "##############"
    requestPage = requests.get(url=urlMainPage, headers=headers, timeout=30)
    soupPage = bs4.BeautifulSoup(requestPage.text.encode('utf-8'), 'lxml')
    getHouseUrlList = []
    listUrl = soupPage.find_all(name='a', attrs={'target':'_blank', 'tongji_label':'listclick'})
    for url in listUrl:
        getHouseUrlList.append(urlRoot + url.get('href'))
    return getHouseUrlList


def GetHouseInfo(getHouseUrlList, headers, houseInfoList):
    for url in getHouseUrlList:
        requestHouse = requests.get(url=url, headers=headers, timeout=30)
        soupHouse = bs4.BeautifulSoup(requestHouse.text.encode('utf-8'), 'lxml')
        houseNameList = soupHouse.title.text
        houseName = ""
        for word in houseNameList:
            houseName = houseName + word
        lon = re.findall(r'____json4fe.lon = (.*?);', soupHouse.prettify())
        lat = re.findall(r'____json4fe.lat = (.*?);', soupHouse.prettify())
        moneyList = soupHouse.find(name='span', attrs={'class': 'price'}).text[:5]
        money = ""
        for word in moneyList:
            if word != " ":
                money = money + word
            else:
                break
        houseInfoList.append([houseName.split(u'\u3011')[1].split(",")[0].encode(encoding='UTF-8', errors='strict'), url, money, lon[0], lat[0]])
        print houseName.split(u'\u3011')[1].encode(encoding='UTF-8', errors='strict') + " " + url
        time.sleep(5)
    return houseInfoList


def writeInfo(houseInfoList):
    csvFile = open("C:/Users/Rui/Desktop/Info.csv", "ab")
    writer = csv.writer(csvFile)
    for info in houseInfoList:
        writer.writerow(info)
    csvFile.close()


def main():
    host = "bj.58.com"
    referer = "http://bj.58.com/pinpaigongyu/?minprice={minprice}_{maxprice}"
    user_agent = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
    prices = [[600, 1000], [1000, 1500], [1500, 2000], [2000, 3000], [3000, 5000], [5000, 8000], [8000, 30000]]
    urlPage = "http://bj.58.com/pinpaigongyu/pn/{page}/?minprice={minprice}_{maxprice}"
    for price in prices:
        minprice = price[0]
        maxprice = price[1]
        page = 1
        headers = {'Host': host, 'Referer': referer.format(minprice=minprice, maxprice=maxprice), 'User_agent': user_agent}
        while True:
            houseInfo = []
            urlMainPage = urlPage.format(page=page, minprice=minprice, maxprice=maxprice)
            getUrlList = GetUrlList(urlMainPage, headers)
            if getUrlList:
                print("####################The %d-%d %d page####################" % (minprice, maxprice, page))
                houseInfoList = GetHouseInfo(getUrlList, headers, houseInfo)
                writeInfo(houseInfoList)
                page += 1
                time.sleep(20)
            else:
                break

main()
