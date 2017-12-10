---
title: 使用VPS搭建VPN – PPTP
date: 2016-10-03 16:16:24
tags:
---
<span style="color: #a39d9d;">最近闲着没事，自己租了个VPS顺手搭了个VPN出来。</span>

首先去随便买个境外的VPS，我这边买了个香港的，还算便宜。

以下过程全部在SSH远程连接下操作。

<hr />

<h2>1、 安装pptpd</h2>

<pre class="lang:sh decode:true">$ apt-get install pptpd</pre>

<h2>2、 配置pptpd</h2>

编辑pptpd.conf文件，设置localip和remoteip

<pre class="lang:sh decode:true">$ vim /etc/pptpd.conf</pre>

添加localip和remoteip，将其设置为下面的形式（其中VPS_IP为你的VPS公网ip）

<pre class="nums:false lang:default decode:true">localip VPS_IP
remoteip 10.100.0.2-100</pre>

<div class="line">修改dns设置</div>

<div class="line">
<pre class="lang:sh decode:true" style="padding-left: 30px;">$ vim /etc/ppp/pptpd-options</pre>
</div>

查找到ms-dns，配置dns，这里以google的dns（8.8.8.8）为例（我配置成了香港沙田的dns）

<pre class="nums:false lang:default decode:true">ms-dns 8.8.8.8
ms-dns 8.8.4.4</pre>

<div class="line">设置VPN的账号和密码</div>

<div class="line">编辑chap-secrets文件</div>

<div class="line">
<pre class="lang:sh decode:true">$ vim /etc/ppp/chap-secrets</pre>
</div>

在其中加入如下格式的配置（每行对应一个VPN账号）

<span class="lang:default decode:true crayon-inline">用户名 pptpd 密码 *</span>

<h2>3、 启动pptpd</h2>

<pre class="lang:sh decode:true">$ /etc/init.d/pptpd restart</pre>

<h2>4、 开启ipv4转发</h2>

编辑sysctl.conf文件

<pre class="lang:sh decode:true">$ vim /etc/sysctl.conf</pre>

将<span class="lang:sh decode:true crayon-inline">net.ipv4.ip_forward=1</span> <code>的注释去掉，退出并保存</code>

运行<span class="lang:sh decode:true crayon-inline ">sysctl -p</span> <code>使</code>更改生效

<h2>5、 配置iptables</h2>

<pre class="lang:sh decode:true">$ iptables -t nat -A POSTROUTING -s 10.100.0.0/24 -o eth0 -j MASQUERADE
$ iptables -A FORWARD -s 10.100.0.0/24 -p tcp -m tcp --tcp-flags SYN,RST SYN -j TCPMSS --set-mss 1430
$ iptables -t nat -A POSTROUTING -s 10.100.0.0/24 -j SNAT --to-source VPS_IP
$ iptables-save &gt; /etc/iptables-rules</pre>

编辑网卡文件<span class="lang:sh decode:true crayon-inline ">$ vim /etc/network/interfaces</span>

在其末尾加入<span class="lang:sh decode:true crayon-inline ">pre-up iptables-restore &lt; /etc/iptables-rules</span>

配置iptables持久化

<pre class="lang:sh decode:true">$ apt-get install iptables-persistent
$ service iptables-persistent start</pre>

<h2>6、 其它</h2>

<ol>
    <li>如果不能VPN连接不上，可以尝试完全卸载iptables重新配置。</li>
    <li>由于一般网卡的MTU都是1500，因此VPN的MTU值可以尝试从1024逐渐增大，文中的1430是当前最大值。</li>
</ol>